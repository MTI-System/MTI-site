import {makeTournamentsStoreServer} from "@/api/tournaments/serverStore";
import {tournamentsApiServer} from "@/api/tournaments/serverApiInterface";
import TeamInTournamentPage from "@/components/tournaments/TeamInTournamentPage";
import {UserAvatarWithTitleByID} from "@/components/ui/Avatars";
import UsersProviderWrapper from "@/api/users/ClientWrapper";

export default async function InfoProblemsTournamentPage(
  { params }: { params: Promise<{ id: number }>}
) {
  const id = (await params).id
  const tournamentsStore = makeTournamentsStoreServer()
  const { data: tournamentCard, error } = await tournamentsStore.dispatch(
    tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: id }),
  )
  return (
    <>
      <h1 className="w-full text-center font-bold text-2xl mb-4 text-text-main">Команды, принимающие участие в турнире</h1>
      <div className="flex flex-col gap-2">
        {tournamentCard?.teams.map(t=>(
          <div key={t.id} className="px-10 py-3 border-border rounded-2xl border">
            <TeamInTournamentPage mainData={t}/>
          </div>

        ))}
      </div>
    </>
  )
}
