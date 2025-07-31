import style from "@/styles/routes/(main)/problems/page.module.css"
import ProblemFilters from "@/components/sections/problems/ProblemsFilter"
import ProblemsList from "@/components/sections/problems/ProblemsList"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { Suspense } from "react"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { fetchYears } from "@/scripts/ApiFetchers"
import SearchParamsUpdator from "@/components/service/SearchParamsUpdator"
import UnlockTournamentType from "@/components/Redux/UnlockTournamentType";

export default async function Page({ searchParams }: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined
  console.log("tt", tt)

  const possibleYears = await fetchYears(availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1)
  const year = sp.year ?? possibleYears[0]

  return (
    <>
      <UnlockTournamentType/>
      <Suspense fallback={"Load search params"}>
        <SearchParamsUpdator />
      </Suspense>
      <div className={style.problemPage}>
        <div className={style.problemsContainer}>
          <h2>Задачи на {availableTournamentTypes.find((val) => val.name === tt)?.longName}</h2>

          {tt && (
            <ProblemFilters possibleYears={possibleYears}>
              <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
                <ProblemsList year={year} tt={tt} />
              </Suspense>
            </ProblemFilters>
          )}
        </div>
      </div>
    </>
  )
}
