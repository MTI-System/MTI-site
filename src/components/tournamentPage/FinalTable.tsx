import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import twclsx from "@/utils/twClassMerge"
import Link from "next/link"
import style from "@/styles/gradient.module.css"

export default async function FinalTable({ fightId, tournamentId }: { fightId: number, tournamentId: number }) {
   const trStyle = "font-medium bg-transparent"
    const store = makeTournamentsStoreServer()
    const promise = store.dispatch(tournamentsApiServer.endpoints.getFightContainerInfo.initiate({ fightContainerId: fightId }))
    const { data: fightContainerInfo, error: fightContainerError } = await promise
    console.log("FINAL CONTAINER ERROR", fightContainerInfo, fightContainerError)
    if (fightContainerError)
        return <p className="text-accent-warning">error</p>
    if (!fightContainerInfo || fightContainerInfo.length !== 1)
        return <p className="text-accent-warning">error</p>
    const data = fightContainerInfo[0]
    let minScore = -1
    let maxScore = 61
    data.teams?.forEach(team => {
        if (team.score > maxScore || maxScore === 61) maxScore = team.score
        if (team.score < minScore || minScore === -1) minScore = team.score
    })
    console.log(data.teams)
    return (
        <>
        <h2 className="text-text-main w-full pb-3 text-center text-2xl font-bold">Таблица финала</h2>
        {data.teams && data.teams.length > 0 ? <div className="flex items-start justify-start overflow-x-auto shrink-0 border-border rounded-2xl border mx-8 my-4">
        <table className="w-full 0 overflow-hidden">
          <thead className={twclsx(
            trStyle,
            "border-b-border border-b"
            )}>
            <tr key={0} className="">
              <td className="bg-card-alt text-text-main font-bold">
                <p className="flex flex-row h-full w-full px-10 py-4 sm:text-sm text-md lg:text-lg font-medium">КОМАНДА</p>
              </td>
              <td className="bg-card-alt text-text-main font-bold">
                <p className="text-text-main h-full w-full cursor-pointer px-2 py-4 text-center sm:text-sm text-md lg:text-lg font-medium">ОБЩИЙ БАЛЛ</p>
              </td>
              <td className="bg-card-alt text-text-main font-bold">
                <p className="text-text-main h-full w-full cursor-pointer px-6 py-4 text-center sm:text-sm text-md lg:text-lg font-medium">Д</p>
              </td>
              <td className="bg-card-alt text-text-main font-bold">
                <p className="text-text-main h-full w-full cursor-pointer px-6 py-4 text-center sm:text-sm text-md lg:text-lg font-medium">О</p>
              </td>
              <td className="bg-card-alt text-text-main font-bold">
                <p className="text-text-main h-full w-full cursor-pointer px-6 py-4 text-center sm:text-sm text-md lg:text-lg font-medium">Р</p>
              </td>
            </tr>
            </thead>

            <tbody className="divide-y divide-border">
                {data.teams?.map((team, idx) => (
            <tr key={idx}>
                  <td className={trStyle}>
                    <Link
                      className="text-text-main hover:bg-hover flex flex-row h-full w-full cursor-pointer px-10 py-2 sm:text-sm text-md lg:text-lg font-medium"
                      href={`/tournaments/${tournamentId}/team/${team.id}`}
                    >
                        {team.name}
                    </Link>
                  </td>
                  
                  <td
                      className={twclsx(
                        trStyle,
                        style.sampledText,
                        "text-text-main sm:text-sm text-md lg:text-lg cursor-pointer px-2 py-1 text-center rounded-full"
                      )}

                        style={{
                        ["--t" as any]: (team.score - minScore) / (maxScore - minScore),
                      }}
                    >
                      {team.score ?? '-'}
                    </td>
                  <td
                      className={twclsx(
                        trStyle,
                        "text-text-main sm:text-sm text-md lg:text-lg cursor-pointer px-2 py-1 text-center rounded-full"
                      )}
                    >
                      {team.reporterScore ?? '-'}
                    </td>
                    <td
                      className={twclsx(
                        trStyle,
                        "text-text-main sm:text-sm text-md lg:text-lg cursor-pointer px-2 py-1 text-center rounded-full"
                      )}
                    >
                      {team.opponentScore ?? '-'}
                    </td>
                    <td
                      className={twclsx(
                        trStyle,
                        "text-text-main sm:text-sm text-md lg:text-lg cursor-pointer px-2 py-1 text-center rounded-full"
                      )}
                    >
                      {team.reviewerScore ?? '-'}
                    </td>
                  </tr>
                  ))}
          </tbody>
        </table>
      </div> : <p className="text-text-main w-full text-center pt-2 pb-6">Пока нет данных о финалистах</p>}
        </>
    )
}