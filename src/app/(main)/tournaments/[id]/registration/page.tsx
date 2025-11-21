import { makeRegistrationStoreServer } from "@/api/registration/serverStore"
import { registrationApiServer } from "@/api/registration/serverApiInterface"
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm";
import { DayPicker } from "react-day-picker";

export default async function RegisterTournamentsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id

  const store = makeRegistrationStoreServer()
  const promise = store.dispatch(
    registrationApiServer.endpoints.getRegistrationForm.initiate({
      id: Number(id),
      type: "registration",
    }),
  )
  const { data: formInfo, error, isError } = await promise

  return (
    <>
      {isError && <h2>Error</h2>}
      {formInfo && (

        // <RegistrationProviderWrapper>
        //   <RegistrationForm className="flex w-full flex-col items-center gap-2" formInfo={formInfo} />
        // </RegistrationProviderWrapper>
        <TournamentRegistrationForm formInfo={formInfo} className={""} isEdit={true}/>
      )}
    </>
  )
}
