import ApplicationsPage from "@/components/tournamentPage/Forms/Applications/ApplicationsPage";
import UsersProviderWrapper from "@/api/users/ClientWrapper";

export default async function ApplicationsPageList({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id
  return (
    <>
      <UsersProviderWrapper>
        <ApplicationsPage id={id}/>
      </UsersProviderWrapper>

    </>
  )
}
