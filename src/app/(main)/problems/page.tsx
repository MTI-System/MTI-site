import ProblemFilters from "@/components/sections/problems/ProblemsFilter"
import ProblemsList from "@/components/sections/problems/ProblemsList"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import style from "@/styles/problems/problemsList.module.css"
import { redirect, RedirectType } from "next/navigation"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { DEFAULT_YEAR } from "@/constants/DefaultProblemFilters"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME,AUTH_TOKEN_KEY_NAME } from "@/constants/CookieKeys"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import {Right} from "@/types/authApi"
import OrganizationProblemCard from "@/components/sections/organizator/problems/OrganizationProblemCard";
import OrganizationProblemList from "@/components/sections/organizator/problems/OrganizationProblemList";

export default async function Page({ searchParams }: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  const cookie = await cookies()
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined
  if (!tt) {
    tt = cookie.get(TOURNAMENT_TYPE_KEY_NAME)?.value ?? availableTournamentTypes[0]
    redirect(`/problems?${TOURNAMENT_TYPE_SEARCH_PARAM_NAME}=${tt}`, RedirectType.replace)
    return
  }
  const year = sp.year ?? DEFAULT_YEAR


  const userAuth = await fetchPermissions(false, "")
  let isModerator = false
  if (userAuth && userAuth.rights.length !== 0) {
    isModerator = userAuth.rights.map(right => right.right_flag == "MODERATE_PROBLEMS_" + (availableTournamentTypes.indexOf(tt) + 1)).some(x=>x)
  }
  console.log("user", userAuth, isModerator)

  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <h2>Текущие задачи турнира {tt}</h2>
        <ProblemFilters />
        {year && tt && (
          <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
            {!isModerator && <ProblemsList year={year} tt={tt}/>}
            {isModerator && <OrganizationProblemList year={year}/>}
          </Suspense>
        )}
      </div>
    </div>
  )
}
