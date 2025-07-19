import ProblemFilters from "@/components/sections/problems/ProblemsFilter"
import ProblemsList from "@/components/sections/problems/ProblemsList"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import style from "@/styles/problems/problemsList.module.css"
import { redirect, RedirectType } from "next/navigation"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { fetchPermissions, fetchYears } from "@/scripts/ApiFetchers"
import OrganizationProblemList from "@/components/sections/organizator/problems/OrganizationProblemList"
import { AddProblem } from "@/components/sections/problems/ProblemForms"

export default async function Page({ searchParams }: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  const cookie = await cookies()
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined
  if (!tt) {
    tt = cookie.get(TOURNAMENT_TYPE_KEY_NAME)?.value ?? availableTournamentTypes[0].name
    redirect(`/problems?${TOURNAMENT_TYPE_SEARCH_PARAM_NAME}=${tt}`, RedirectType.replace)
    return
  }
  const possibleYears = await fetchYears(availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1)
  const year = sp.year ?? possibleYears[0]

  const userAuth = await fetchPermissions()
  let isModerator = false
  if (userAuth && userAuth.rights.length !== 0) {
    isModerator = userAuth.rights
      .map(
        (right) =>
          right.right_flag == "MODERATE_PROBLEMS_" + availableTournamentTypes.find((val) => val.name === tt)?.id
      )
      .some((x) => x)
  }

  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <h2>Задачи на {availableTournamentTypes.find((val) => val.name === tt)?.longName}</h2>
        <ProblemFilters possibleYears={possibleYears} />
        <AddProblem isShown={isModerator} />
        {year && tt && (
          <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
            <ProblemsList year={year} tt={tt} isEditable={isModerator} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
