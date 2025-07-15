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
  const authToken = cookie.get(AUTH_TOKEN_KEY_NAME)?.value
  let premissionList: Right[]|null = null
  if (authToken) premissionList = await fetchPermissions(authToken, true, "problems")
  console.log("permissions list", premissionList)
  console.log("token", authToken)
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <ProblemFilters />
        {year && tt && (
          <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
            <ProblemsList year={year} tt={tt} canEdit={false}/>
          </Suspense>
        )}
      </div>
    </div>
  )
}
