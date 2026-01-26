import {useGetActionInformationQuery} from "@/api/tournaments/clientApiInterface";
import {CallInterface, TeamInTournamentInterface} from "@/types/TournamentsAPI";
import {useGetProblemsByIdQuery, useGetProblemsQuery} from "@/api/problems/clientApiInterface";
import twclsx from "@/utils/twClassMerge";

export default function DraftList({actionId}: { actionId: number }) {
  const {data: actionData, isLoading: isActionData, error: actionErr} = useGetActionInformationQuery({actionId})
  const chellendger = actionData?.drafts?.chellenger
  const chellendged = actionData?.drafts?.chellenged
  return (
    <>
      {actionData?.drafts ?
          <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-text-main border-collapse border-spacing-0">
                  <thead>
                  <tr className="border-b-border border-b">
                      <th className="border-r border-border px-2 py-1">Вызов</th>
                      <th className="px-2 py-1">Результат</th>
                  </tr>
                  </thead>
                  <tbody>
                  {actionData?.drafts?.calls.map((call, index) => (
                    <tr key={index}>
                      {chellendger && chellendged && <DraftItem call={call} chellendger={chellendger} chellendged={chellendged}/>}
                    </tr>
                  ))}
                  </tbody>
              </table>
          </div>:
        <p>Процедура вызова еще не состоялась</p>
      }
    </>

  )
}

function DraftItem(
  {call, chellendger, chellendged}: {
    call: CallInterface,
    chellendger: TeamInTournamentInterface,
    chellendged: TeamInTournamentInterface
  }
) {
  const {data: problemData} = useGetProblemsByIdQuery({problemId: call.problemId})
  return (
    <>
      <td className="text-start border-r border-border px-2 py-1">Команда <strong>{chellendger.name}</strong> вызывает
        команду <strong>{chellendged.name}</strong> на
        задачу <a className="font-bold hover:text-text-hover" href={`/problems/${problemData?.id}`}>№{problemData?.global_number} {problemData?.problem_translations[0].problem_name}</a></td>
      <td
        className={twclsx("text-center px-2 py-1", {"text-accent-accept": call.result}, {"text-red-500": !call.result})}>{call.result ? "Принято" : "Отказ"}</td>
    </>
  )
}