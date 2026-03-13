import AdminAssignmentPanel from "@/components/tournamentPage/adminPanel/AdminAssignmentPanel"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

export default async function AdminTmpPanelPage({ params }: { params: Promise<{ id: number }> }) {
  const tournamentId = (await params).id
  return (
    <>
      <TournamentsProviderWrapper>
        <AdminAssignmentPanel tournamentId={tournamentId} />
      </TournamentsProviderWrapper>
    </>
  )
}
