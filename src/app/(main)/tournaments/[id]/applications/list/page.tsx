import ApplicationsPage from "@/components/tournamentPage/Forms/Applications/ApplicationsPage";

export default async function ApplicationsPageList({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id
  return (
    <>
      <ApplicationsPage id={id}/>
    </>
  )
}
