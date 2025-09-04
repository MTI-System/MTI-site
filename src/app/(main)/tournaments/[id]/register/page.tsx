import {fetchRegistrationForm} from "@/scripts/ApiFetchers";
import RegistrationForm from "@/components/tournaments/Forms/RegistrationForm";

export default async function RegisterTournamentsPage(
  {params}: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  const formInfo = await fetchRegistrationForm(Number(id))
  return (
    <>
      <div className="bg-bg-alt w-full rounded-2xl mt-2 mb-5 px-2 py-5">
        <RegistrationForm className="flex flex-col gap-2 items-center w-full" formInfo={formInfo}/>
      </div>

    </>
  )
}