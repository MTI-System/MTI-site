import {fetchRegistrationForm} from "@/scripts/ApiFetchers";
import RegistrationForm from "@/components/tournamentPage/Forms/RegistrationForm";

export default async function RegisterTournamentsPage(
  {params}: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  const formInfo = await fetchRegistrationForm(Number(id), "registration");
  return (
    <>
        <RegistrationForm className="flex flex-col gap-2 items-center w-full" formInfo={formInfo}/>


    </>
  )
}