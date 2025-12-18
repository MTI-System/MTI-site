export function FightTable({teams}:{teams: {
        name: string;
        id: number;
        score: number;
        coefficient: number;
        reported_problem?: number | undefined;
        reporterScore?: number | undefined;
        opponentScore?: number | undefined;
        reviewerScore?: number | undefined;
    }[]
  }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-border border-b">
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Название команды</th>
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Балл за бой</th>
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">к</th>
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Сыгранная задача</th>
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Д</th>
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">О</th>
          <th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Р</th>
          </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {teams.map((item) => (
          <tr key={item.id} className="hover:bg-hover transition-colors text-text-main">
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.name ? item.name : "-"}</td>
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.score ? item.score : "-"}</td>
            <td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.coefficient? item.coefficient : "-"}</td>
            <td className="px-4 py-3 text-center text-sm font-medium">{item.reported_problem ? item.reported_problem : "-"}</td>
            <td className="px-4 py-3 text-center text-sm font-medium">{item.reporterScore ? item.reporterScore : "-"}</td>
            <td className="px-4 py-3 text-center text-sm font-medium">{item.opponentScore ? item.opponentScore : "-"}</td>
            <td className="px-4 py-3 text-center text-sm font-medium">{item.reviewerScore ? item.reviewerScore : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}