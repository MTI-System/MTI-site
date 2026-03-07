import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import twclsx from "@/utils/twClassMerge"
import style from "@/styles/gradient.module.css"
import Link from "next/link"
import React from "react"

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
      <div className="border-border mx-8 my-4 flex shrink-0 items-start justify-start overflow-x-auto rounded-2xl border">
        <table className="0 w-full overflow-hidden">
          <thead className={twclsx(trStyle, "border-b-border border-b")}>
            <tr key={0} className="">
              <td className="bg-card-alt text-text-main font-bold" rowSpan={2} scope="col">
                <p className="text-md flex h-full w-full flex-row px-10 py-4 font-medium sm:text-sm lg:text-lg">
                  КОМАНДА
                </p>
              </td>
              <td className="bg-card-alt text-text-main font-bold" rowSpan={2} scope="col">
                <p className="text-md flex h-full w-full flex-row px-10 py-4 font-medium sm:text-sm lg:text-lg">
                  ИНТРО
                </p>
              </td>

              {table?.table_lines[maxFilledFightsIndex].scores.map((score, idx) => (
                <td key={idx} className="bg-card-alt text-text-main font-medium" colSpan={2} scope="col">
                  <Link
                    className="text-text-main hover:bg-hover text-md flex h-full w-full cursor-pointer flex-row items-center justify-center px-2 py-4 font-medium sm:text-sm lg:text-lg"
                    href={`/tournaments/${tournamentId}/fights/${score.fight_container_id}`}
                  >
                    {score.fight_container_name.toUpperCase()}
                  </Link>
                </td>
              ))}
              <td className="bg-card-alt text-text-main font-medium" rowSpan={2} scope="col">
                <p className="text-md flex h-full w-full flex-row px-2 py-4 text-center font-medium text-wrap sm:text-sm lg:text-lg">
                  ИТОГО
                </p>
              </td>
              <td className="bg-card-alt text-text-main font-medium" rowSpan={2} scope="col">
                <p className="text-md flex h-full w-full flex-row px-2 py-4 text-end font-medium text-wrap sm:text-sm lg:text-lg">
                  ИТОГОВЫЙ П.П.
                </p>
              </td>
            </tr>

            <tr>
              {table?.table_lines[maxFilledFightsIndex].scores.map((score, idx) => (
                <React.Fragment key={idx}>
                  <td key={idx} className="bg-card-alt text-text-main font-medium text-center" scope="col">
                    Баллы
                  </td>
                  <td key={idx + "PP"} className="bg-card-alt text-text-main font-medium text-center" scope="col">
                    П.П.
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody className="divide-border divide-y">
            {table?.table_lines.map((line, idx) => {
              return (
                <tr key={idx}>
                  <td className={trStyle}>
                    <Link
                      className="text-text-main hover:bg-hover text-md flex h-full w-full cursor-pointer flex-row px-10 py-2 font-medium sm:text-sm lg:text-lg"
                      href={`/tournaments/${tournamentId}/team/${line.team_id}`}
                    >
                      {line.team_name}
                    </Link>
                  </td>
                  <td
                    className={twclsx(
                      trStyle,
                      "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                      {
                        "text-text-hover!":
                          (line.team_id === 52 || line.team_id === 53 || line.team_id === 46) && tournamentId === 10,
                      },
                    )}
                  >
                    {line.opening_score}
                  </td>
                  {line.scores.map((score, idx) => (
                    <React.Fragment key={idx}>
                      <td
                        className={twclsx(
                          trStyle,
                          style.sampledText,
                          "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                          {
                            "text-text-hover!":
                              (line.team_id === 52 || line.team_id === 53 || line.team_id === 46) &&
                              tournamentId === 10,
                          },
                        )}
                        style={{
                          ["--t" as any]: (score.score - minScore) / (maxScore - minScore),
                        }}
                      >
                        {score.score}
                      </td>
                      <td
                        className={twclsx(
                          trStyle,
                          style.sampledText,
                          "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                          {
                            "text-text-hover!":
                              (line.team_id === 52 || line.team_id === 53 || line.team_id === 46) &&
                              tournamentId === 10,
                          },
                        )}
                        style={{
                          ["--t" as any]: (score.win_coefficient),
                        }}
                      >
                        {score.win_coefficient}
                      </td>
                    </React.Fragment>
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
                  <td
                    className={twclsx(trStyle, "text-text-main text-md px-2 py-1 md:text-lg", {
                      "text-text-hover!":
                        (line.team_id === 52 || line.team_id === 53 || line.team_id === 46) && tournamentId === 10,
                    })}
                  >
                    {line.resultScore}
                    {(line.team_id === 52 || line.team_id === 53 || line.team_id === 46) &&
                      tournamentId === 10 &&
                      " (Вне зачёта)"}
                  </td>
                  <td
                    className={twclsx(trStyle, "text-text-main text-md px-2 py-1 text-center md:text-lg", {
                      "text-text-hover!":
                        (line.team_id === 52 || line.team_id === 53 || line.team_id === 46) && tournamentId === 10,
                    })}
                  >
                    {line.result_win_coefficient}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}