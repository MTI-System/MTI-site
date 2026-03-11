import { TeamLogsInterface } from "@/types/TournamentsAPI"
import { ProblemInterface } from "@/types/problemAPI"
import twclsx from "@/utils/twClassMerge"

export default function TeamLog({
  log,
  fightsList,
  isYNT,
}: {
  log: TeamLogsInterface["teams"][number]
  fightsList: { name: string; id: number }[]
  isYNT: boolean
}) {
  return (
    <div className="text-text-main flex w-full flex-col content-center items-center justify-center gap-4 px-2 py-6">
      <p className="w-full text-center text-2xl font-bold">{log.team.name}</p>
      <div className="w-full overflow-x-auto">
        <div className="flex w-full min-w-fit flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch">
          <div className="flex w-full lg:w-auto lg:shrink-0">
            <table className="border-border w-full min-w-sm border-separate border-spacing-0 overflow-hidden rounded-xl border lg:h-full lg:max-w-md">
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
          {isYNT && (
            <div className="flex w-full lg:w-auto lg:shrink-0">
              <table className="border-border w-full min-w-50 border-separate border-spacing-0 overflow-hidden rounded-xl border lg:h-full lg:max-w-md">
                <thead>
                  <tr>
                    <th className="border-border border-r p-2">
                      NR{" "}
                      {(log.yellow_cards?.nr?.length ?? 0) > 0 && (
                        <>
                          {" "}
                          (
                          {log.yellow_cards?.nr?.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.value,
                            0,
                          )}
                          )
                        </>
                      )}
                    </th>
                    <th className="border-border border-r p-2">
                      NP
                      {(log.yellow_cards?.np?.length ?? 0) > 0 && (
                        <>
                          {" "}
                          (
                          {log.yellow_cards?.np?.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.value,
                            0,
                          )}
                          )
                        </>
                      )}
                    </th>
                    <th className="p-2">
                      NT{" "}
                      {(log.yellow_cards?.nt?.length ?? 0) > 0 && (
                        <>
                          {" "}
                          (
                          {log.yellow_cards?.nt?.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.value,
                            0,
                          )}
                          )
                        </>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-border border-t border-r p-2">
                      {(log.yellow_cards?.nr?.length ?? 0) > 0 ? (
                        log.yellow_cards?.nr?.map((val) => (
                          <p className="text-center">{val.fight_name ?? "Бой не указан"}</p>
                        ))
                      ) : (
                        <p className="text-center">-</p>
                      )}
                    </td>
                    <td className="border-border border-t border-r p-2">
                      {(log.yellow_cards?.np?.length ?? 0) > 0 ? (
                        log.yellow_cards?.np?.map((val) => (
                          <p className="text-center">{val.fight_name ?? "Бой не указан"}</p>
                        ))
                      ) : (
                        <p className="text-center">-</p>
                      )}
                    </td>
                    <td className="border-border border-t p-2">
                      {(log.yellow_cards?.nt?.length ?? 0) > 0 ? (
                        log.yellow_cards?.nt?.map((val) => (
                          <p className="text-center">{val.fight_name ?? "Бой не указан"}</p>
                        ))
                      ) : (
                        <p className="text-center">-</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {fightsList.length > 0 && (
            <div className="flex w-full lg:w-auto lg:flex-1">
              <table className="border-border w-full min-w-md table-auto border-separate border-spacing-0 overflow-hidden rounded-xl border lg:h-full">
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
                        // TODO: Rewrite for ids not for names
                        const fightRoles = p.fights
                          .filter((pf) => pf.fight_container_title === f.name)
                          .map((pf) => pf.role)
                        // console.log(f.id, p.fights)
                        return (
                          <td className="border-border border-t border-l px-2" key={idx}>
                            <div className="flex w-full items-center justify-center gap-1">
                              {fightRoles.length > 0 ? (
                                fightRoles.map((role, i) =>
                                  role === "REPORTER" ? (
                                    <p key={i} className="text-center font-bold text-green-600 dark:text-green-400">
                                      Д
                                    </p>
                                  ) : role === "OPPONENT" ? (
                                    <p key={i} className="text-center font-bold text-yellow-600 dark:text-yellow-400">
                                      О
                                    </p>
                                  ) : role === "REVIEWER" ? (
                                    <p key={i} className="text-center font-bold text-red-600 dark:text-red-400">
                                      Р
                                    </p>
                                  ) : (
                                    <p key={i} className="text-center">
                                      {role}
                                    </p>
                                  ),
                                )
                              ) : (
                                <p className="text-center">-</p>
                              )}
                            </div>
                          </td>
                        )
                      })}
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
function TasksList({
  action,
  tasks,
  isFirstRow,
}: {
  action: string
  tasks: (ProblemInterface | null)[]
  isFirstRow?: boolean
}) {
  return (
    <>
      <td className={`border-border w-0 border-r ${isFirstRow ? "" : "border-t"}`}>
        <p className="p-2">{action}</p>
      </td>
      <td className={`border-border ${isFirstRow ? "" : "border-t"} py-1`}>
        {tasks.length > 0 ? (
          tasks.map(
            (task) =>
              task && (
                <div key={task.id} className="flex gap-1 px-2 py-0.25">
                  <p>{task.local_number ?? `(${task.global_number})`}.</p>
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
