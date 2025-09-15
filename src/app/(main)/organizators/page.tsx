import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner";
import {fetchOrganizatorTournamentsCards, fetchTournamentsCards} from "@/scripts/ApiFetchers";
import TournamentsStoreProviderWrapper from "@/components/Redux/TournamentsReduxProvider";
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams";
import TournamentsFilters from "@/components/tournaments/TournamentsFilters";
import {Suspense} from "react";

export default async function OrganizationsMainPage({searchParams}: {
    searchParams: Promise<{ year: string; tt: string; page: string }>
}) {
    const sp = await searchParams
    const tournamentsCards = await fetchOrganizatorTournamentsCards(Number(sp.tt) ?? 1, Number(sp.year) )
    return (
        <>
            <TournamentsStoreProviderWrapper>
                <TournamentsSearchParams searchParams={sp}/>
                <TournamentsFilters/>
                <TournamentCardsSpinner tournamentsCards={tournamentsCards} isModerator={true}/>
            </TournamentsStoreProviderWrapper>

        </>
    )
}