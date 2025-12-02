
import { Toast } from "@base-ui-components/react/toast"
import {TournamentCreationRequest} from "@/types/TournamentsAPI";
import CreateTournamentForm from "@/components/tournamentPage/CreateTournamentFrom";
import {cookies} from "next/headers";
import {makeTournamentsStoreServer} from "@/api/tournaments/serverStore";
import {tournamentsApiServer} from "@/api/tournaments/serverApiInterface";


export interface TournamentCardCallback {
  (card: Partial<TournamentCreationRequest>): void
}

export default async function CreateTournamentPage() {
  const tt = Number((await cookies()).get("mtiyt_tournamentType")?.value ?? -1)


  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}))
  const { data: tournamentTypes } = await promise
  const currentTT = tournamentTypes?.find(tType => tType.id === tt)
  if (tt === -1 || !currentTT) {
    return <p>Unavailable tt</p>
  }
  return (
    <Toast.Provider limit={10}>
      <CreateTournamentForm tt={currentTT}/>
    </Toast.Provider>
  )
}
