import TournamentsPageTabs from "@/components/tournamentPage/TournamentsPageTabs"

export default async function ModerateTournamentPage({ params }: { params: Promise<{ id: string; tab: string }> }) {
  const paramsObj = await params
  const tab = paramsObj.tab
  const id = paramsObj.id
  return <></>
}
