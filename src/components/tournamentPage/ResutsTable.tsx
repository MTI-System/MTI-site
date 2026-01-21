import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import twclsx from "@/utils/twClassMerge"
import style from "@/styles/gradient.module.css"
import Link from "next/link"

export default async function ResultsTable({ tournamentId }: { tournamentId: number }) {
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentTable.initiate({ id: tournamentId }))
  const { data: table, error } = await promise
  console.log("tournament fetch", table, error)
  // const table = await fetchTournamentTable(tournamentId)
  const trStyle = "border border-border font-medium bg-transparent"
  const maxScore = Math.max(...(table?.table_lines.map((l) => Math.max(...l.scores.map((s) => s.score))) ?? [0]))
  const minScore = Math.min(
    ...(table?.table_lines.map((l) => Math.min(...l.scores.map((s) => s.score).filter((val) => val !== 0))) ?? [0]),
  )

  // const maxFightsFilled = Math.max(...table?.table_lines.map(l=>l.scores.length)??[0])
  if (table?.table_lines.length === 0)
    return (
      <>
        <h2 className="text-text-main w-full pb-5 text-center text-2xl font-bold">Турнирная таблица</h2>
        <p className="text-text-main w-full text-center">Пока нет результатов</p>
      </>
    )

  const maxFilledFightsIndex =
    table?.table_lines.map((x, i) => [x.scores.length, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1] ?? 0
  const maxFightsFilled = table?.table_lines[maxFilledFightsIndex].scores.length ?? 0

  return (
    <>
      <h2 className="text-text-main w-full pb-5 text-center text-2xl font-bold">Турнирная таблица</h2>
      <div className="flex shrink-0 items-start justify-start overflow-x-auto">
        <table className="border-border w-full shrink-0 border-separate border-spacing-0 overflow-hidden rounded-xl border">
          <tbody>
            <tr key={0}>
              <td className="bg-card-alt border-border text-text-main border font-bold">
                <p className="block h-full w-full px-2 py-1">Название команды</p>
              </td>
              {table?.table_lines[maxFilledFightsIndex].scores.map((score, idx) => (
                <td key={idx} className="bg-card-alt border-border text-text-main border font-medium">
                  <Link
                    className="text-text-main hover:bg-hover block h-full w-full cursor-pointer px-2 py-1"
                    href={`/tournaments/${tournamentId}/fights/${score.fight_container_id}`}
                  >
                    {score.fight_container_name}
                  </Link>
                </td>
              ))}
              <td className="bg-card-alt border-border text-text-main border font-medium">
                <p className="block h-full w-full px-2 py-1">Итого</p>
              </td>
            </tr>
            {table?.table_lines.map((line, idx) => {
              return (
                <tr key={idx}>
                  <td className={trStyle}>
                    <Link
                      className="text-text-main hover:bg-hover block h-full w-full cursor-pointer px-2 py-1"
                      href={`/tournaments/${tournamentId}/team/${line.team_id}`}
                    >
                      {line.team_name}
                    </Link>
                  </td>

                  {line.scores.map((score, idx) => (
                    <td
                      key={idx}
                      className={twclsx(
                        trStyle,
                        style.sampledText,
                        "text-text-main hover:bg-hover cursor-pointer px-2 py-1",
                      )}
                      style={{ ["--t" as any]: (score.score - minScore) / (maxScore - minScore) }}
                    >
                      {score.score}
                    </td>
                  ))}
                  {Array(maxFightsFilled - line.scores.length)
                    .fill(null)
                    .map((_, index) => (
                      <td
                        key={`${idx}  ${index}`}
                        className={twclsx(trStyle, style.sampledText, "px-2 py-1")}
                        style={{ ["--t" as any]: (0 - minScore) / (maxScore - minScore) }}
                      >
                        0
                      </td>
                    ))}
                  <td className={trStyle + " text-text-main px-2 py-1"}>{line.resultScore}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
