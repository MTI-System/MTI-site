import { makeRegistrationStoreServer } from "@/api/registration/serverStore"
import { registrationApiServer } from "@/api/registration/serverApiInterface"
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { cookies } from "next/headers"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import type {Metadata} from "next";
import {makeTournamentsStoreServer} from "@/api/tournaments/serverStore";
import {tournamentsApiServer} from "@/api/tournaments/serverApiInterface";
import {FaCircleCheck} from "react-icons/fa6";

export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ id: number }>
}): Promise<Metadata> {
  const searchP = await params

  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentCard.initiate({id: searchP.id}))
  const { data: tournamentCard } = await promise
  const titleText = tournamentCard ? `Заявка · ${tournamentCard.title} – МТИ` : `Турнир – МТИ`

  const descriptionText = tournamentCard
    ? `Подача заявки на турнир ${tournamentCard.title} ${tournamentCard.year} года: регистрируйся на научный турнир!.`
    : "Подача заявки на турнир в системе МТИ."

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}



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
    
    // if (user) {
    //   const registrationPromise = store.dispatch(registrationApiServer.endpoints.isFormFilled.initiate({ tournamentId: Number(id), formFlag: "registration", userId: user.user_id }))
    //   const { data: isFormFilledData, error: isFormFilledError, isError: isFormFilledIsError } = await registrationPromise
    //   if (isFormFilledData) isFormFilled = isFormFilledData
    // }
  }

  return (
    <>
      {isError && <h2>{JSON.stringify(error)}</h2>}
      {/* {formInfo && !isAdmin && <TournamentRegistrationForm formInfo={formInfo} className={""} isEdit={!isFormFilled} />} */}

      {formInfo && <TournamentRegistrationForm tournamentId={Number(id)} formInfo={formInfo} className={""} isEdit={!isFormFilled} />}
      {isAdmin && <h2>Вы администратор турнира</h2>}
    </>
  )
}
