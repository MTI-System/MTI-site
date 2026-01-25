import { TeamLogsInterface } from "@/types/TournamentsAPI"
import { ProblemInterface } from "@/types/problemAPI"
import twclsx from "@/utils/twClassMerge"

export default function TeamLog({
  log,
  fightsList,
}: {
  log: TeamLogsInterface["teams"][number]
  fightsList: { name: string; id: number }[]
}) {
  return (
    <div className="text-text-main flex w-full flex-col content-center items-center justify-center gap-4 px-2 py-4">
      <p className="w-full text-center text-2xl font-bold">{log.team.name}</p>
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col w-full justify-center items-center gap-6 min-w-fit lg:flex-row lg:items-stretch">
      <div className="flex lg:shrink-0 w-full lg:w-auto">
      <table className="border-border rounded-xl border border-separate border-spacing-0 overflow-hidden min-w-md w-full lg:max-w-md lg:h-full">
        <tbody>
          <tr>
            <TasksList action="Отказы" tasks={log.rejected} isFirstRow />
          </tr>
          <tr className="border-border border-t">
            <TasksList action="Доклады" tasks={log.reported} />
          </tr>
          <tr className="border-border border-t">
            <TasksList action="Оппонирования" tasks={log.opposed} />
          </tr>
        </tbody>
      </table>
      </div>
      {fightsList.length > 0 && (
        <div className="lg:flex-1 flex w-full lg:w-auto">
        <table className="border-border rounded-xl border table-auto border-separate border-spacing-0 overflow-hidden min-w-md w-full lg:h-full">
          <tbody className="w-full">
            <tr>
              <td className="border-border px-2 py-1">
                <p className="text-center">Участник</p>
              </td>
              {fightsList.map((f, i) => (
                <td key={i} className="border-border border-l px-2 py-1">
                  <p className="text-center">{f.name}</p>
                </td>
              ))}
            </tr>
            {log.players.map((p, idx) => (
              <tr className="border-border border-t" key={idx}>
                <td className="border-border border-t px-2 py-1">
                  {p.second_name} {p.first_name} {p.third_name}
                </td>
                {fightsList.map((f, idx) => {
                  const fightRoles = p.fights.filter(pf => pf.fight_id === f.id).map(pf => pf.role)
                  return (<td className="border-border border-l border-t px-2" key={idx}>
                    <div className="flex w-full justify-center items-center gap-1">
                    {fightRoles.length > 0 ? (
                      fightRoles.map((role, i) => (
                        role === "REPORTER" ? (<p key={i} className="text-center text-green-600 dark:text-green-400 font-bold">Д</p>) : 
                        role === "OPPONENT" ? (<p key={i} className="text-center text-yellow-600 dark:text-yellow-400 font-bold">О</p>) : 
                        role === "REVIEWER" ? (<p key={i} className="text-center text-red-600 dark:text-red-400 font-bold">Р</p>) : 
                        <p key={i} className="text-center">{role}</p>
                      ))
                    ) : (<p className="text-center">-</p>)}
                  </div></td>)
                }
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
function TasksList({ action, tasks, isFirstRow }: { action: string; tasks: (ProblemInterface | null)[]; isFirstRow?: boolean }) {
  return (
    <>
      <td className={`border-border border-r w-0 ${isFirstRow ? '' : 'border-t'}`}>
        <p className="p-2">{action}</p>
      </td>
      <td className={`border-border ${isFirstRow ? '' : 'border-t'} py-1`}>
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
