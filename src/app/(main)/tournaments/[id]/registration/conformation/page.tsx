import Loading from "@/app/loading"
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest"
import ConfirmationPage from "@/components/tournamentPage/Forms/Confirmation/ConfirmationPage"

export default async function ConfirmationP({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id
  return (
    <>
      <ConfirmationPage tournamentId={id} />
    </>
  )
}
