import {tournamentsApiServer} from "@/api/tournaments/serverApiInterface"
import {makeTournamentsStoreServer} from "@/api/tournaments/serverStore"
import twclsx from "@/utils/twClassMerge";
import style from "@/styles/gradient.module.css"
import Link from "next/link";

export default async function ResultsTable({tournamentId}: { tournamentId: number }) {
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentTable.initiate({id: tournamentId}))
  const {data: table, error} = await promise
  console.log("tournament fetch", table, error)
  // const table = await fetchTournamentTable(tournamentId)
  const trStyle = "border border-border px-2 py-1 font-medium bg-transparent"
  const maxScore = Math.max(...table?.table_lines.map(l=>Math.max(...l.scores.map(s=>s.score)))??[0])
  const minScore = Math.min(...table?.table_lines.map(l=>Math.min(...l.scores.map(s=>s.score)))??[0])

  const maxFightsFilled = Math.max(...table?.table_lines.map(l=>l.scores.length)??[0])

  return (
    <>
      <h2 className="w-full text-center text-2xl text-text-main font-bold pb-5">Турнирная таблица</h2>
      <div className="flex items-center justify-center">
        <table className="border-border w-full border-separate border-spacing-0 overflow-hidden rounded-xl border">
          <tbody>
          <tr key={0}>
            <td className="bg-card-alt border-border text-text-main border px-2 py-3 font-bold">
              Название команды
            </td>
            {table?.table_lines[0].scores.map((score, idx) => (
              <td key={idx}
                  className="bg-card-alt border-border text-text-main border px-2 py-1 font-medium hover:bg-hover hover:cursor-pointer">
                {score.fight_container_name}
              </td>
            ))}
            <td className="bg-card-alt border-border text-text-main border px-2 py-1 font-medium">Итого</td>
          </tr>
          {table?.table_lines.map((line, idx) => {
            return (
              <tr key={idx}>

                 
                <td className={trStyle + " text-text-main hover:bg-hover cursor-pointer"}>
                 <Link href={`/tournaments/${tournamentId}/team/${line.team_id}`}>{line.team_name}</Link>
                </td>
                

                {line.scores.map((score, idx) => (
                  <td
                    key={idx} className={twclsx(trStyle, style.sampledText, " text-text-main hover:bg-hover cursor-pointer")}
                    style={{["--t" as any]: (score.score - minScore) / (maxScore - minScore)}}
                  >
                    {score.score}
                  </td>
                ))}
                {Array(maxFightsFilled - line.scores.length).fill(null).map((_, index) => (
                  <td
                    key={`${idx}  ${index}`} className={twclsx(trStyle, style.sampledText)}
                    style={{["--t" as any]: (0 - minScore) / (maxScore - minScore)}}
                  >
                    0
                  </td>
                ))}
                <td className={trStyle + " text-text-main"}>{line.resultScore}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </>
  )
}
