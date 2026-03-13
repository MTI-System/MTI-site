import ProblemsProviderWrapper from "@/api/problems/ClientWrapper";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface";
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore";
import { Fight4Table } from "@/components/tournaments/Fight4Table";

export default async function SelectedTasksPage({ params }: { params: Promise<{ fightId: string; id: string }> }){
    const {id: tournamentId } = await params
    const store = makeTournamentsStoreServer()
    const {data, error} = await store.dispatch(tournamentsApiServer.endpoints.getFightInfoByTournament.initiate({tournamentId: Number(tournamentId)}))
    if (!data)
        return <p className="text-accent-warning">Произошла ошибка</p>
    let  selectedTasksData: {team_id: number, team_name: string, problem_id: number | undefined}[] = []
    for (const fight_name in data){
        const fight_data = data[fight_name]
        fight_data.forEach(fight=>{
            if(fight.id !== 40 && fight.id !== 39 && fight.id !== 38 && fight.id !== 37 && fight.id !== 36 && fight.id !== 35 || !fight.teams) return
            fight.teams?.forEach(team => {
                if (selectedTasksData.find(st=>st.team_id === team.id)) return
                selectedTasksData = [...selectedTasksData, {
                    team_id: team.id,
                    team_name: team.name,
                    problem_id: team.reported_problem
                }]
            })
        })
    }
    return (
        <div className="flex flex-col gap-5">
        {tournamentId === '10' && selectedTasksData.map((team, index) => (
  
          <ProblemsProviderWrapper>
            <TournamentsProviderWrapper key={index}>
              <Fight4Table team={team} tournamentId={Number(tournamentId)}/>
            </TournamentsProviderWrapper>
          </ProblemsProviderWrapper>
        ))}
      </div>
    )
}