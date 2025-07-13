import ProblemFilters from "@/components/sections/problems/ProblemsFilter"
import ProblemsList from "@/components/sections/problems/ProblemsList"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import style from "@/styles/problems/problemsList.module.css"
import { redirect, RedirectType } from "next/navigation"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { DEFAULT_YEAR } from "@/constants/DefaultProblemFilters"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"

export default async function Page({ searchParams }: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined
  if (!tt) {
    const cookie = await cookies()
    tt = cookie.get(TOURNAMENT_TYPE_KEY_NAME)?.value ?? availableTournamentTypes[0]
    console.log(tt)
    redirect(`/problems?${TOURNAMENT_TYPE_SEARCH_PARAM_NAME}=${tt}`, RedirectType.replace)
  }
  const year = sp.year ?? DEFAULT_YEAR
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <ProblemFilters />
        {year && tt && (
          <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
            <ProblemsList year={year} tt={tt} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
