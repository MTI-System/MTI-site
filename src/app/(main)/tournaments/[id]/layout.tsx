import {fetchTournamentsCard} from "@/scripts/ApiFetchers";
import TournamentCard from "@/components/tournaments/TournamentCard";
import NotFound from "@/components/service/NotFound";
import {redirect} from "next/navigation";
import TournamentsPageTabs from "@/components/tournaments/TournamentsPageTabs";
import {ReactNode, Suspense} from "react";

export default async function TournamentPage(
  {params, children}: { params: Promise<{id: number}>, children: ReactNode }
){
  const id = (await params).id
  // const tournamentPageTab = reqParams[1]


  const tournamentId = Number(id)
  const tournament = await fetchTournamentsCard(tournamentId)
  return (
    <>
      {tournament && <div className="pt-5">
        <TournamentCard tournamentCard={tournament} isExtended={true}/>
      </div>}
      {!tournament && <NotFound />}

      {children}


    </>
  )
}