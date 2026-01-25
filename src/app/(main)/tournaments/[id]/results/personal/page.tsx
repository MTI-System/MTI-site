import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import UserResultsTable from "@/components/tournamentPage/UserResutsTable";

export default async function InfoProblemsTournamentPage({ params }: { params: Promise<{ id: number }> }) {
  const tournamentId = (await params).id
  return (
    <>
      <TournamentsProviderWrapper>
        <UserResultsTable tournamentId={tournamentId} />
      </TournamentsProviderWrapper>
    </>
  )
}
