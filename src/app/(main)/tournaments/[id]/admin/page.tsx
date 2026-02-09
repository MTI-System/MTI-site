import AdminPanel from "@/components/tournamentPage/adminPanel/AdminPanel"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

export default async function AdminTmpPanelPage({ params }: { params: Promise<{ id: number }> }) {
  const tournamentId = (await params).id
  return (
    <>
      <TournamentsProviderWrapper>
        <AdminPanel tournamentId={tournamentId} />
      </TournamentsProviderWrapper>
    </>
  )
}
