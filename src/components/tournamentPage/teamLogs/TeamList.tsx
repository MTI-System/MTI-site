import { TeamLogsInterface } from "@/types/TournamentsAPI"
import TeamLog from "./TeamLog"

export default function TeamLogsList({ logs, fightsList }: { logs: TeamLogsInterface; fightsList: string[] }) {
  return (
    <div className="w-full">
      {logs.teams.map((teamLog, i) => (
        <div key={teamLog.team.id}>
          <TeamLog log={teamLog} fightsList={fightsList} />
          {i !== logs.teams.length - 1 && <div className="border-border w-full border"></div>}
        </div>
      ))}
    </div>
  )
}
