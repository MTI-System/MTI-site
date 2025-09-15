import {fetchTournamentsCard} from "@/scripts/ApiFetchers";
import TournamentCard from "@/components/tournaments/TournamentCard";
import NotFound from "@/components/service/NotFound";
import {redirect} from "next/navigation";
import TournamentsPageTabs from "@/components/tournaments/TournamentsPageTabs";
import {ReactNode, Suspense} from "react";
import Loading from "@/app/loading";
import ResultsTable from "@/components/tournaments/ResutsTable";

export default async function TournamentPage(
    {params, children}: { params: Promise<{ id: number }>, children: ReactNode }
) {
    const id = (await params).id
    // const tournamentPageTab = reqParams[1]


    const tournamentId = Number(id)
    const tournament = await fetchTournamentsCard(tournamentId)
    return (
        <>
            <Suspense fallback={<Loading/>}>
                {tournament && <div className="pt-5">
                    <TournamentCard tournamentCard={tournament} isExtended={true} isModerator={false}/>
                </div>}
                {!tournament && <NotFound/>}
                <TournamentsPageTabs />
                {/*<TournamentsPageTabs tab={"info"}>*/}
                {/*    <TournamentTab currentTab={"info"} title={"Инфо"} linkFlag={"info"} iconSrc={"InfoTabIcon.svg"}/>*/}
                {/*    /!*<TournamentTab currentTab={tab} title={"Результаты"} linkFlag={"results"}*!/*/}
                {/*    /!*               iconSrc={"ResultsTabIcon.svg"}/>*!/*/}
                {/*    /!*<TournamentTab currentTab={tab} title={"Бои"} linkFlag={"fights"} iconSrc={"FightsTabIcon.svg"}/>*!/*/}
                {/*    /!*<TournamentTab currentTab={tab} title={"Статистика"} linkFlag={"stats"}*!/*/}
                {/*    /!*               iconSrc={"StatsTabIcon.svg"}/>*!/*/}
                {/*</TournamentsPageTabs>*/}
                <div className="bg-bg-alt w-full rounded-2xl mb-5 px-2 py-5">
                    {children}
                </div>

            </Suspense>


        </>
    )
}