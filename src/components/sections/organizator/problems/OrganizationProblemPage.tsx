import style from "@/styles/problems/problemsList.module.css";
import ProblemFilter from "@/components/sections/problems/ProblemsFilter";
import OrganizationProblemList from "@/components/sections/organizator/problems/OrganizationProblemList";
import {ReactNode, Suspense} from "react";
import {TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";
import {cookies} from "next/headers";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";
import {redirect, RedirectType} from "next/navigation";
import {DEFAULT_YEAR} from "@/constants/DefaultProblemFilters";
import ProblemFilters from "@/components/sections/problems/ProblemsFilter";
import ProblemsList from "@/components/sections/problems/ProblemsList";

async function OrganizationProblemPage({ searchParams }: { searchParams: Promise<{ year: number; tt: string }> }) {
  const sp = await searchParams
  let tt = sp[TOURNAMENT_TYPE_SEARCH_PARAM_NAME] ?? undefined
  if (!tt) {
    const cookie = await cookies()
    tt = cookie.get(TOURNAMENT_TYPE_KEY_NAME)?.value ?? availableTournamentTypes[0]
    console.log(tt)
    redirect(`/organization/problems?${TOURNAMENT_TYPE_SEARCH_PARAM_NAME}=${tt}`, RedirectType.replace)
  }
  const year = sp.year ?? DEFAULT_YEAR
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <ProblemFilters />
        {year && tt && (
          <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
            <OrganizationProblemList year={year}/>
          </Suspense>
        )}
      </div>
    </div>
  )


    //   return (<TestComp>
    //   <div className="flex flex-col items-center bg-gray-100">
    //     <div className={style.problemsContainer}>
    //       <ProblemFilter />
    //
    //     </div>
    //   </div>
    // </TestComp>)
}

export default OrganizationProblemPage;