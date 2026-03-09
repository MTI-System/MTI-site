import { problemsApiServer } from "@/api/problems/serverApiInterface"
import { makeProblemsStoreServer } from "@/api/problems/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import Link from "next/link"

export async function FightTable({
  teams,
  tournamentId,
}: {
  teams: {
    name: string
    id: number
    score: number
    nr?: number
    np?: number
    ny?: number
    nt?: number
    coefficient: number
    reported_problem?: number | undefined
    reporterScore?: number | undefined
    opponentScore?: number | undefined
    reviewerScore?: number | undefined
    win_coefficient?: number
  }[]
  tournamentId: number
}) {
  const store = makeProblemsStoreServer()
  const problems = await Promise.all(
    teams.map(async (item) => {
      if (!item.reported_problem) return null
      const promise = store.dispatch(
        problemsApiServer.endpoints.getProblemsById.initiate({ problemId: item.reported_problem }),
      )
      const { data: problemData, error } = await promise
      return error ? null : problemData
    }),
  )
  const promiseTournament = store.dispatch(
    problemsApiServer.endpoints.getProblemsForTournament.initiate({ tournamentId: tournamentId }),
  )
  const { data: problemsTournamentData, error: problemsTournamentError } = await promiseTournament
  const storeTournaments = makeTournamentsStoreServer()
  const { data: tournament, error: tournamentError } = await storeTournaments.dispatch(
    tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: tournamentId }),
  )
  const isYNT = tournament?.tournament_type === 2

  return (
    <table className="border-border w-full">
      <thead>
        <tr className="border-b-border border-b">
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
            Название команды
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
            Балл за бой
          </th>
          {isYNT && (
            <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
              П.П.
            </th>
          )}
          {!isYNT && (
            <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
              к
            </th>
          )}
          {isYNT && (
            <>
              <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
                NR
              </th>
              <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
                NP
              </th>
              <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
                NT
              </th>
            </>
          )}
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
            Сыгранная задача
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
            Д
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
            О
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-xs md:text-lg">
            Р
          </th>
        </tr>
      </thead>
      <tbody className="divide-border divide-y">
        {teams.map((item, index) => (
          <tr key={item.id} className="text-text-main transition-colors">
            <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
              {item.name ? item.name : "-"}
            </td>
            <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
              {item.score ? item.score : "-"}
            </td>
            {isYNT && (
              <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
                {item.win_coefficient ? item.win_coefficient : "-"}
              </td>
            )}
            {!isYNT && (
              <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
                {item.coefficient ? item.coefficient : "-"}
              </td>
            )}

            {isYNT && (
              <>
                <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
                  {item.nr ? item.nr : "-"}
                </td>
                <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
                  {item.np ? item.np : "-"}
                </td>
                <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
                  {item.nt ? item.nt : "-"}
                </td>
              </>
            )}

            <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
              {problems[index] ? (
                <Link
                  className="hover:bg-hover block h-full w-full cursor-pointer px-4 py-3 transition-colors"
                  href={`/${problems[index] ? "problems/" + problems[index].id : "problems/"}`}
                >
                  {problems[index]?.local_number ??
                    problemsTournamentData?.find((p) => p.id === problems[index]?.id)?.local_number ??
                    `(${problems[index]?.global_number})`}
                </Link>
              ) : (
                "-"
              )}
            </td>

            <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
              {item.reporterScore ? item.reporterScore : "-"}
            </td>
            <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
              {item.opponentScore ? item.opponentScore : "-"}
            </td>
            <td className="text-md px-4 py-3 text-center font-medium sm:text-sm lg:text-lg">
              {item.reviewerScore ? item.reviewerScore : "-"}
            </td>

            {/*TODO: Make this work: */
            /* <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.name ? item.name : "-"}</Link></td>
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.score ? item.score : "-"}</Link></td>
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.coefficient? item.coefficient : "-"}</Link></td>
            <td className="px-4 py-3 text-center text-sm font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.reported_problem ? item.reported_problem : "-"}</Link></td>
            <td className="px-4 py-3 text-center text-sm font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.reporterScore ? item.reporterScore : "-"}</Link></td>
            <td className="px-4 py-3 text-center text-sm font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.opponentScore ? item.opponentScore : "-"}</Link></td>
            <td className="px-4 py-3 text-center text-sm font-medium"><Link href={`/tournaments/${tournamentId}/fight/${item.id}`}>{item.reviewerScore ? item.reviewerScore : "-"}</Link></td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
