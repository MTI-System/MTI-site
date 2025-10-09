import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"

export default async function ResultsTable({ tournamentId }: { tournamentId: number }) {
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentTable.initiate({ id: tournamentId }))
  const { data: table, error } = await promise
  console.log("tournament fetch", table, error)
  // const table = await fetchTournamentTable(tournamentId)
  const trStyle = "border border-border px-2 py-1 font-medium text-text-main bg-transparent"
  return (
    <>
      <div className="flex items-center justify-center">
        <table className="border-border w-[70%] border-separate border-spacing-0 overflow-hidden rounded-2xl border-[0.5px]">
          <tbody>
            <tr key={0}>
              <td className="bg-card-alt border-border text-text-main border px-2 py-3 font-medium">
                Название команды
              </td>
              {table?.table_lines[0].scores.map((score, idx) => (
                <td key={idx} className="bg-card-alt border-border text-text-main border px-2 py-1 font-medium">
                  {score.fight_container_name}
                </td>
              ))}
              <td className="bg-card-alt border-border text-text-main border px-2 py-1 font-medium">Итого</td>
            </tr>
            {table?.table_lines.map((line, idx) => {
              return (
                <tr key={idx}>
                  <td className={trStyle}>{line.team_name}</td>
                  {line.scores.map((score, idx) => (
                    <td key={idx} className={trStyle}>
                      {score.score}
                    </td>
                  ))}
                  <td className={trStyle}>{line.resultScore}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
