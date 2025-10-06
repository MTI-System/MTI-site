import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner";
import {fetchOrganizatorTournamentsCards, fetchPermissions, fetchTournamentsCards} from "@/scripts/ApiFetchers";
import TournamentsStoreProviderWrapper from "@/components/Redux/TournamentsReduxProvider";
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams";
import TournamentsFilters from "@/components/tournaments/TournamentsFilters";
import {Suspense} from "react";
import Loading from "@/app/loading";
import {redirect} from "next/navigation";

export default async function OrganizationsMainPage({searchParams}: {
    searchParams: Promise<{ year: string; tt: string; page: string }>
}) {
    const sp = await searchParams
    if (!sp.year || !sp.tt || !sp.page) {
        return (
            <TournamentsStoreProviderWrapper>
                <TournamentsSearchParams searchParams={sp}/>
                <TournamentsFilters/>
                <div className="w-full h-[50rem]">
                    <Loading/>
                </div>

            </TournamentsStoreProviderWrapper>
        )
    }
    const tournamentsCards = await fetchOrganizatorTournamentsCards(Number(sp.tt) ?? 1, Number(sp.year))
    const userAuth = await fetchPermissions()
    if (!userAuth) {
        redirect("/login")
    }
    return (
        <>
            <TournamentsStoreProviderWrapper>
                <TournamentsSearchParams searchParams={sp}/>
                <TournamentsFilters/>
                <TournamentCardsSpinner tournamentsCards={tournamentsCards} isModerating={true} rights={userAuth.rights}/>
            </TournamentsStoreProviderWrapper>

        </>
    )
}