import ProblemFilters from "@/components/sections/problems/ProblemsFilter"
import ProblemsList from "@/components/sections/problems/ProblemsList"
import {availableTournamentTypes} from "@/constants/AvailableTournaments"
import style from "@/styles/problems/problemsList.module.css"
import {redirect, RedirectType} from "next/navigation"
import {cookies} from "next/headers"
import {Suspense} from "react"
import {TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys"
import {fetchPermissions, fetchYears} from "@/scripts/ApiFetchers"
import OrganizationProblemList from "@/components/sections/organizator/problems/OrganizationProblemList";
import {PROBLEM_API} from "@/constants/APIEndpoints";
import Loading from "@/app/(main)/loading";
import {AddProblem} from "@/components/sections/problems/ProblemForms"
import SearchParamsUpdator from "@/components/SearchParamsUpdator";


export default async function Page({searchParams}: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined

  const possibleYears = await fetchYears(availableTournamentTypes.find(val => val.name === tt)?.id ?? 1)
  const year = sp.year ?? possibleYears[0]
  const ttid = availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1
  // console.log("REDNDER", year, tt)

  return (
    <>
      <Suspense fallback={"Load search params"}>
        <SearchParamsUpdator/>
      </Suspense>
      <div className={style.problemPage}>
        <div className={style.problemsContainer}>
          <h2>Задачи на {availableTournamentTypes.find((val) => val.name === tt)?.longName}</h2>

          {year && tt && (
            <ProblemFilters possibleYears={possibleYears}>
              <>
                <AddProblem targetTTID={ttid} targetYear={year}/>
                <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
                  <ProblemsList year={year} tt={tt}/>
                </Suspense>
              </>
            </ProblemFilters>
          )}
        </div>
      </div>
    </>

  )
}
