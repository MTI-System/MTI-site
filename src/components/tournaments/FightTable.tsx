import { problemsApiServer } from "@/api/problems/serverApiInterface";
import { makeProblemsStoreServer } from "@/api/problems/serverStore";
import Link from "next/link";

export async function FightTable({
  teams,
}: {
  teams: {
    name: string
    id: number
    score: number
    coefficient: number
    reported_problem?: number | undefined
    reporterScore?: number | undefined
    opponentScore?: number | undefined
    reviewerScore?: number | undefined
  }[]
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
  return (
    <table className="border-border w-full">
      <thead>
        <tr className="border-b-border border-b">
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            Название команды
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            Балл за бой
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            к
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            Сыгранная задача
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            Д
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            О
          </th>
          <th className="text-md text-text-main px-4 py-3 text-center font-medium tracking-wider text-wrap uppercase sm:text-sm">
            Р
          </th>
        </tr>
      </thead>
      <tbody className="divide-border divide-y">
        {teams.map((item, index) => (
          <tr key={item.id} className="transition-colors text-text-main">
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.name ? item.name : "-"}</td>
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.score ? item.score : "-"}</td>
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.coefficient? item.coefficient : "-"}</td>

            <td className=" text-center text-sm font-medium  ">    
              {problems[index] ?  
                  <Link
                  className="block h-full w-full cursor-pointer px-4 py-3 hover:bg-hover transition-colors" 
                  href={`/${problems[index] ? "problems/" +  problems[index].id : "problems/"}`}> 
                  {problems[index].global_number}
                  </Link>: "-"}
              
            </td>

            <td className="px-4 py-3 text-center text-sm font-medium">{item.reporterScore ? item.reporterScore : "-"}</td>
            <td className="px-4 py-3 text-center text-sm font-medium">{item.opponentScore ? item.opponentScore : "-"}</td>
            <td className="px-4 py-3 text-center text-sm font-medium">{item.reviewerScore ? item.reviewerScore : "-"}</td>
            
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
