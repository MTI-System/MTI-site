import {fetchTournamentTable} from "@/scripts/ApiFetchers";

export default async function ResultsTable({tournamentId}: { tournamentId: number }) {
  const table = await fetchTournamentTable(tournamentId);
  const trStyle = "border px-2 py-1 font-medium text-text-main"
  return (
    <>
      <div className="flex items-center justify-center">
        <table className="border w-[70%] rounded-lg border-separate border-spacing-0 overflow-hidden border-text-main">
          <tbody>
          <tr key={0}>
            <td className={trStyle}>Название команды</td>
            {table?.table_lines[0].scores.map((score, idx) => <td key={idx} className={trStyle}>{score.fight_container_name}</td>)}
            <td className={trStyle}>Итого</td>
          </tr>
          {table?.table_lines.map((line, idx) => {
            return <tr key={idx}>
              <td className={trStyle}>{line.team_name}</td>
              {line.scores.map((score, idx) => <td key={idx} className={trStyle}>{score.score}</td>)}
              <td className={trStyle}>{line.resultScore}</td>
            </tr>
          })}
          </tbody>
        </table>
      </div>

    </>
  )
}