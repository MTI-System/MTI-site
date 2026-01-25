import { TeamLogsInterface } from "@/types/TournamentsAPI"
import { ProblemInterface } from "@/types/problemAPI"
import twclsx from "@/utils/twClassMerge"

export default function TeamLog({
  log,
  fightsList,
}: {
  log: TeamLogsInterface["teams"][number]
  fightsList: string[]
}) {
  return (
    <div className="text-text-main flex w-full flex-col content-center items-center justify-center gap-2 p-2">
      <p className="w-full pb-2 text-center text-2xl font-bold">{log.team.name}</p>
      <table className="border-border flex rounded-xl border">
        <tbody>
          <tr>
            <TasksList action="Отказы" tasks={log.rejected} />
          </tr>
          <tr>
            <TasksList action="Доклады" tasks={log.reported} />
          </tr>
          <tr>
            <TasksList action="Оппонирования" tasks={log.opposed} />
          </tr>
        </tbody>
      </table>
      {fightsList.length > 0 && (
        <table className="border-border flex rounded-xl border">
          <tbody>
            <tr>
              {["Участник", ...fightsList].map((f, i) => (
                <td key={i} className={twclsx("border-border px-2 py-1", { "border-r": i !== fightsList.length })}>
                  <p>{f}</p>
                </td>
              ))}
            </tr>
            {log.players.map((p) => (
              <tr className="border-border border-t">
                <td className="px-2">
                  {p.second_name} {p.first_name} {p.third_name}
                </td>
                {fightsList.map((f) => {
                  return (
                    <td className="border-border border-l px-2">
                      <p className="text-center">-</p>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
function TasksList({ action, tasks }: { action: string; tasks: (ProblemInterface | null)[] }) {
  return (
    <>
      <td className="border-border border-r">
        <p className="p-2">{action}</p>
      </td>
      <td className="py-1">
        {tasks.length > 0 ? (
          tasks.map(
            (task) =>
              task && (
                <div key={task.id} className="flex gap-1 px-2 py-0.25">
                  <p>{task.local_number ?? `(${task.global_number})`}</p>
                  {task.problem_translations.length > 0 && <p>{task.problem_translations[0].problem_name}</p>}
                </div>
              ),
          )
        ) : (
          <p className="px-4">-</p>
        )}
      </td>
    </>
  )
}
