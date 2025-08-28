import TournamentsFilters from "@/components/tournaments/TournamentsFilters";
import {fetchTournamentsCards} from "@/scripts/ApiFetchers";
import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner";

export default async function TournamentsPage(){
  const tournamentsCards = await fetchTournamentsCards(1, 2025)
  return (
    <>
      <div className="pt-5">
        <TournamentsFilters/>
        <TournamentCardsSpinner tournamentsCards={tournamentsCards}/>
      </div>
    </>
  )
}