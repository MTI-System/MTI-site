import {fetchTournamentsCard} from "@/scripts/ApiFetchers";
import TournamentCard from "@/components/tournaments/TournamentCard";
import NotFound from "@/components/service/NotFound";
import {redirect} from "next/navigation";
import TournamentsPageTabs from "@/components/tournamentPage/TournamentsPageTabs";
import {ReactNode, Suspense} from "react";
import Loading from "@/app/loading";
import ResultsTable from "@/components/tournamentPage/ResutsTable";
import TournamentPageStoreProviderWrapper from "@/components/Redux/TournamentPageStoreProvider";

export default async function TournamentPage(
    {params, children}: { params: Promise<{ id: number }>, children: ReactNode }
) {
    const id = (await params).id
    // const tournamentPageTab = reqParams[1]


    const tournamentId = Number(id)
    const tournament = await fetchTournamentsCard(tournamentId)
    if (!tournament) {
        return <>Error</>
    }

    return (
        <>
            <TournamentPageStoreProviderWrapper tournament={tournament}>
                <Suspense fallback={<Loading/>}>
                    {tournament && <div className="pt-5">
                        <TournamentCard tournamentCard={tournament} isExtended={true} isCreate={false}/>
                    </div>}
                    {!tournament && <NotFound/>}
                    <TournamentsPageTabs tournamentCard={tournament}/>
                    <div className="bg-bg-alt w-full min-h-[50rem] rounded-2xl mb-5 px-2 py-5">
                        {children}
                    </div>

                </Suspense>
            </TournamentPageStoreProviderWrapper>

        </>
    )
}