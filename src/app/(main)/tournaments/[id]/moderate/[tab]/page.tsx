import TournamentsPageTabs, {TournamentTab} from "@/components/tournaments/TournamentsPageTabs";

export default async function ModerateTournamentPage(
    {params}: { params: Promise<{ id: string, tab: string }> }
) {
    const paramsObj = await params
    const tab = paramsObj.tab
    const id = paramsObj.id
    return (
        <>
            {/*<TournamentsPageTabs tab={tab}>*/}
            {/*    <TournamentTab currentTab={tab} title={"Инфо"} linkFlag={"info"} iconSrc={"InfoTabIcon.svg"}/>*/}
            {/*    <TournamentTab currentTab={tab} title={"Заявки"} linkFlag={"requests"} iconSrc={"RequestsTabIcon.svg"}/>*/}
            {/*    <TournamentTab currentTab={tab} title={"Персонал"} linkFlag={"admins"} iconSrc={"AdminsTabIcon.svg"}/>*/}
            {/*    <TournamentTab currentTab={tab} title={"Бои"} linkFlag={"fights"} iconSrc={"FightsTabIcon.svg"}/>*/}
            {/*    <TournamentTab currentTab={tab} title={"Результаты"} linkFlag={"results"} iconSrc={"ResultsTabIcon.svg"}/>*/}
            {/*    <TournamentTab currentTab={tab} title={"Статистика"} linkFlag={"stats"} iconSrc={"StatsTabIcon.svg"}/>*/}
            {/*    <TournamentTab currentTab={tab} title={"Настройки"} linkFlag={"settings"} iconSrc={"InfoTabIcon.svg"}/>*/}
            {/*</TournamentsPageTabs>*/}
        </>
    )
}