import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import twclsx from "@/utils/twClassMerge"
import Link from "next/link"
import style from "@/styles/gradient.module.css"

export default async function FinalTable({ fightId, tournamentId }: { fightId: number; tournamentId: number }) {
  const trStyle = "font-medium bg-transparent"
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(
    tournamentsApiServer.endpoints.getFightContainerInfo.initiate({ fightContainerId: fightId }),
  )
  const { data: fightContainerInfo, error: fightContainerError } = await promise
  console.log("FINAL CONTAINER ERROR", fightContainerInfo, fightContainerError)
  if (fightContainerError) return <p className="text-accent-warning">error</p>
  if (!fightContainerInfo || fightContainerInfo.length !== 1) return <></> // <p className="text-accent-warning">error</p>
  const data = fightContainerInfo[0]
  let minScore = -1
  let maxScore = 61
  data.teams?.forEach((team) => {
    if (team.score > maxScore || maxScore === 61) maxScore = team.score
    if (team.score < minScore || minScore === -1) minScore = team.score
  })
  console.log(data.teams)
  if (data.teams && data.teams.length === 0) return <></>
  return (
    <>
      <h2 className="text-text-main w-full pb-3 text-center text-2xl font-bold">Таблица финала</h2>
      {data.teams && data.teams.length > 0 ? (
        <div className="border-border mx-8 my-4 flex shrink-0 items-start justify-start overflow-x-auto rounded-2xl border">
          <table className="0 w-full overflow-hidden">
            <thead className={twclsx(trStyle, "border-b-border border-b")}>
              <tr key={0} className="">
                <td className="bg-card-alt text-text-main font-bold">
                  <p className="text-md flex h-full w-full flex-row px-10 py-4 font-medium sm:text-sm lg:text-lg">
                    КОМАНДА
                  </p>
                </td>
                <td className="bg-card-alt text-text-main font-bold">
                  <p className="text-text-main text-md h-full w-full cursor-pointer px-2 py-4 text-center font-medium sm:text-sm lg:text-lg">
                    ОБЩИЙ БАЛЛ
                  </p>
                </td>
                <td className="bg-card-alt text-text-main font-bold">
                  <p className="text-text-main text-md h-full w-full cursor-pointer px-6 py-4 text-center font-medium sm:text-sm lg:text-lg">
                    Д
                  </p>
                </td>
                <td className="bg-card-alt text-text-main font-bold">
                  <p className="text-text-main text-md h-full w-full cursor-pointer px-6 py-4 text-center font-medium sm:text-sm lg:text-lg">
                    О
                  </p>
                </td>
                <td className="bg-card-alt text-text-main font-bold">
                  <p className="text-text-main text-md h-full w-full cursor-pointer px-6 py-4 text-center font-medium sm:text-sm lg:text-lg">
                    Р
                  </p>
                </td>
              </tr>
            </thead>

            <tbody className="divide-border divide-y">
              {data.teams?.map((team, idx) => (
                <tr key={idx}>
                  <td className={trStyle}>
                    <Link
                      className="text-text-main hover:bg-hover text-md flex h-full w-full cursor-pointer flex-row px-10 py-2 font-medium sm:text-sm lg:text-lg"
                      href={`/tournaments/${tournamentId}/team/${team.id}`}
                    >
                      {team.name}
                    </Link>
                  </td>

                  <td
                    className={twclsx(
                      trStyle,
                      style.sampledText,
                      "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                    )}
                    style={{
                      ["--t" as any]: (team.score - minScore) / (maxScore - minScore),
                    }}
                  >
                    {team.score ?? "-"}
                  </td>
                  <td
                    className={twclsx(
                      trStyle,
                      "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                    )}
                  >
                    {team.reporterScore ?? "-"}
                  </td>
                  <td
                    className={twclsx(
                      trStyle,
                      "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                    )}
                  >
                    {team.opponentScore ?? "-"}
                  </td>
                  <td
                    className={twclsx(
                      trStyle,
                      "text-text-main text-md cursor-pointer rounded-full px-2 py-1 text-center sm:text-sm lg:text-lg",
                    )}
                  >
                    {team.reviewerScore ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-text-main w-full pt-2 pb-6 text-center">Пока нет данных о финалистах</p>
      )}
    </>
  )
}
