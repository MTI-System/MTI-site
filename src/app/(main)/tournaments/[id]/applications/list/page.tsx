import ApplicationsPage from "@/components/tournamentPage/Forms/Applications/ApplicationsPage"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { AlertDialog } from "@base-ui-components/react"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import CloseRegistration from "@/components/tournamentPage/Forms/Applications/CloseRegistration"

export default async function ApplicationsPageList({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id
  return (
    <>
      <UsersProviderWrapper>
        <ApplicationsPage id={id} />
      </UsersProviderWrapper>
      <TournamentsProviderWrapper>
        <CloseRegistration tournamentId={id} />
      </TournamentsProviderWrapper>
    </>
  )
}
