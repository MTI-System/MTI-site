import TournamentsFilters from "@/components/tournaments/TournamentsFilters";
import {fetchTournamentsCards} from "@/scripts/ApiFetchers";
import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner";
import {Suspense} from "react";
import Loading from "@/app/loading";
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams";
import TournamentsStoreProvider from "@/components/Redux/TournamentsReduxProvider";

export default async function TournamentsPage({searchParams}: {
  searchParams: Promise<{ year: string; tt: string; page: string }>
}) {
  const sp = await searchParams
  const tournamentsCards = await fetchTournamentsCards(Number(sp.tt) ?? 1, Number(sp.year))
  return (
    <>
      <TournamentsStoreProvider>
        <div className="">
          <TournamentsSearchParams searchParams={sp}/>
          <TournamentsFilters/>
          <TournamentCardsSpinner tournamentsCards={tournamentsCards}/>
        </div>
      </TournamentsStoreProvider>
    </>
  )
}