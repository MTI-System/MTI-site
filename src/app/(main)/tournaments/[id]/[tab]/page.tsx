import {Suspense} from "react";
import TournamentsPageTabs from "@/components/tournaments/TournamentsPageTabs";
import ResultsTable from "@/components/tournaments/ResutsTable";

export default async function TabHomPage(
  {params}: { params: Promise<{ id: string, tab: string }> }
) {
  const paramsObj = await params
  const tab = paramsObj.tab
  const id = paramsObj.id
  return (
    <>
      <TournamentsPageTabs tab={tab}/>
      <div className="bg-bg-alt w-full rounded-2xl mt-2 mb-5 px-2 py-5">
        <Suspense fallback={<h1>Loading...</h1>}>
          {tab === "info" && <h1>Раздел Инфо</h1>}
          {tab === "results" && <ResultsTable tournamentId={Number(id)}/>}
          {tab === "fights" && <h1>Раздел боев</h1>}
          {tab === "stats" && <h1>Раздел статистики</h1>}
        </Suspense>
      </div>


    </>
  )
}