import style from "@/styles/routes/(main)/problems/page.module.css"
import ProblemFilters from "@/components/sections/problems/ProblemsFilter"
import ProblemsList from "@/components/sections/problems/ProblemsList"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { Suspense } from "react"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { fetchPermissions, fetchYears } from "@/scripts/ApiFetchers"
import SearchParamsUpdator from "@/components/service/SearchParamsUpdator"
import UnlockTournamentType from "@/components/Redux/UnlockTournamentType"

export default async function Page({ searchParams }: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined
  console.log("tt", tt)

  const possibleYears = await fetchYears(availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1)
  let isUndefYear = false
  if (sp.year && possibleYears.find((year) => sp.year == year) === undefined) isUndefYear = true
  const year = sp.year ?? possibleYears[0]

  const userAuth = await fetchPermissions()
  let isEditable = false
  if (userAuth && userAuth.rights.length !== 0) {
    isEditable = userAuth.rights
      .map(
        (right) =>
          right.right_flag == "MODERATE_PROBLEMS_" + availableTournamentTypes.find((val) => val.name === tt)?.id
      )
      .some((x) => x)
  }

  return (
    <>
      <UnlockTournamentType />
      <Suspense fallback={"Load search params"}>
        <SearchParamsUpdator />
      </Suspense>
      <div className={style.problemPage}>
        <div className={style.problemsContainer}>
          <h2>Задачи на {availableTournamentTypes.find((val) => val.name === tt)?.longName}</h2>

          {tt && (
            <ProblemFilters possibleYears={possibleYears} isModerator={isEditable}>
              {isUndefYear && <p>На {sp.year} год не найдено опубликованных задач</p>}
              {!isUndefYear && (
                <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
                  <ProblemsList year={year} tt={tt} isEditable={isEditable} />
                </Suspense>
              )}
            </ProblemFilters>
          )}
        </div>
      </div>
    </>
  )
}
