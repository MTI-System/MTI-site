import { makeRegistrationStoreServer } from "@/api/registration/serverStore"
import { registrationApiServer } from "@/api/registration/serverApiInterface"
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { cookies } from "next/headers"
import { makeAuthStoreServer } from "@/api/auth/serverStore"

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

  let isFormFilled = false
  let isAdmin = false
  const token = (await cookies()).get("mtiyt_auth_token")?.value
  if (token) {
    const authStore = makeAuthStoreServer()
    const authPromise = authStore.dispatch(authApiServer.endpoints.fetchPermissions.initiate({ token: token }))
    const { data: user, error: userError } = await authPromise
    if (user?.rights.find((r) => r.right_flag === `MODERATE_TOURNAMENT_${id}`) !== undefined) isAdmin = true
    
    if (user) {
      const registrationPromise = store.dispatch(registrationApiServer.endpoints.isFormFilled.initiate({ tournamentId: Number(id), formFlag: "registration", userId: user.user_id }))
      const { data: isFormFilledData, error: isFormFilledError, isError: isFormFilledIsError } = await registrationPromise
      if (isFormFilledData) isFormFilled = isFormFilledData
    }
  }

  return (
    <>
      {isError && <h2>{JSON.stringify(error)}</h2>}
      {formInfo && !isAdmin && <TournamentRegistrationForm formInfo={formInfo} className={""} isEdit={!isFormFilled} />}
      {/* {formInfo && <TournamentRegistrationForm formInfo={formInfo} className={""} isEdit={!isFormFilled} />} */}
      {isAdmin && <h2>Вы администратор турнира</h2>}
    </>
  )
}
