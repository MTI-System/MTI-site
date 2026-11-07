import AdminPanel from "@/components/tournamentPage/adminPanelOld/AdminPanel"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

export default async function AdminOldPanelPage({ params }: { params: Promise<{ id: number }> }) {
  const tournamentId = (await params).id
  return (
    <>
      <TournamentsProviderWrapper>
        <AdminPanel tournamentId={tournamentId} />
      </TournamentsProviderWrapper>
    </>
  )
}
