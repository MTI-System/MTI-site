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
   const trStyle = "font-medium bg-transparent"
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
    <h2 className="text-text-main w-full pb-3 text-center text-2xl font-bold">Турнирная таблица</h2>
      <div className="flex items-start justify-start overflow-x-auto shrink-0 border-border rounded-2xl border mx-8 my-4">
        <table className="w-full 0 overflow-hidden">
          <thead className={twclsx(
            trStyle,
            "border-b-border border-b"
            )}>
            <tr key={0} className="">

              <td className="bg-card-alt text-text-main font-bold">
                <p className="flex flex-row h-full w-full px-10 py-4 sm:text-sm text-md lg:text-lg font-medium">КОМАНДА</p>
              </td>

              {table?.table_lines[maxFilledFightsIndex].scores.map((score, idx) => (
                <td key={idx} className="bg-card-alt text-text-main font-medium ">
                  <Link
                    className="text-text-main hover:bg-hover flex flex-row h-full w-full cursor-pointer px-2 py-4 items-center justify-center sm:text-sm text-md lg:text-lg font-medium"
                    href={`/tournaments/${tournamentId}/fights/${score.fight_container_id}`}
                  >
                    {score.fight_container_name.toUpperCase()}
                  </Link>
                </td>
              ))}
              <td className="bg-card-alt text-text-main font-medium">
                <p className="flex flex-row h-full w-full text-wrap px-2 py-4 text-end sm:text-sm text-md lg:text-lg font-medium">ИТОГО</p>
              </td>
            </tr>
            </thead>

            <tbody className="divide-y divide-border">
            {table?.table_lines.map((line, idx) => {
              return (
                <tr key={idx}>
                  <td className={trStyle}>
                    <Link
                      className="text-text-main hover:bg-hover flex flex-row h-full w-full cursor-pointer px-10 py-2 sm:text-sm text-md lg:text-lg font-medium"
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
                        "text-text-main sm:text-sm text-md lg:text-lg cursor-pointer px-2 py-1 text-center rounded-full",
                        {"text-text-hover!": line.team_id === 52 && tournamentId === 10}
                      )}

                        style={{
                        ["--t" as any]: (score.score - minScore) / (maxScore - minScore),
                      }}
                    >
                      {score.score}
                    </td>
                  ))}

                  {Array(maxFightsFilled - line.scores.length)
                    .fill(null)
                    .map((_, index) => (
                      <td
                        key={`${idx}  ${index}`}
                        className={twclsx(trStyle, style.sampledText, "px-2 py-1 text-center")}
                        style={{ ["--t" as any]: (0 - minScore) / (maxScore - minScore) }}
                      >
                        0
                      </td>
                    ))}
                  <td className={twclsx(trStyle, "text-text-main md:text-lg text-md px-2 py-1", {"text-text-hover!": line.team_id === 52 && tournamentId === 10})}>{line.resultScore}{line.team_id === 52 && tournamentId === 10 && " (Вне зачёта)"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}