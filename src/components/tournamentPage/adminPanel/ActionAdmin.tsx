"use client"

import {useGetActionInformationQuery, useGetTournamentTableQuery} from "@/api/tournaments/clientApiInterface";
import {useGetProblemsByIdQuery, useGetProblemsQuery} from "@/api/problems/clientApiInterface";
import Loading from "@/app/loading";
import {Accordion} from "@base-ui-components/react";
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin";
import {FightInformationInterface} from "@/types/TournamentsAPI";
import {useGetUserByIdQuery} from "@/api/users/clientApiInterface";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import {ComponentProps} from "react";

export default function ActionAdmin({actionId, idx, fight,}: {
  actionId: number,
  idx: number,
  fight: FightInformationInterface,
}) {
  const {data: actionInfo, isLoading: isActionLoading} = useGetActionInformationQuery({actionId: actionId})
  const {
    data: pickedProblemInfo,
    isLoading: isProblemLoading
  } = useGetProblemsByIdQuery({problemId: actionInfo?.pickedProblem ?? 0})


  const isLoading = isProblemLoading || isProblemLoading
  return (
    <div className="px-2 border border-border my-2 mx-2">
      {isLoading && <Loading/>}
      {!isLoading && (
        <>
          <div className="text-text-main">
            <h2 className="text-xl text-text-main font-bold">Действие {idx + 1}</h2>
            <div>
              <p>Выбрана задача: {pickedProblemInfo?.problem_translations[0].problem_name}</p>
            </div>
            <div>
              <Accordion.Root className="flex w-full flex-col justify-center text-text-main">
              {actionInfo?.playerLines.map((playerLine, idx) => (
                  <Accordion.Item className="border border-border" key={playerLine.playerId + "player" + idx}>
                    <Accordion.Header>
                      <Accordion.Trigger
                        className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-alt py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                        <p>Выступление - {playerLine.team.name} - {playerLine?.role?.title ?? "Роль не определена"}</p>
                        <PlusIcon
                          className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45 text-text-main"/>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel
                      className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-text-main transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                      <div>
                        <form className="w-full flex flex-col items-center">
                          <table className="w-full border border-border">
                            <thead className=" w-full">
                            <tr className="flex justify-between w-full">
                              <th className="border border-border w-full" scope="col">Жюри</th>
                              <th className="border border-border w-full" scope="col">Оценка</th>
                            </tr>
                            </thead>
                            <tbody>
                            <UsersProviderWrapper>
                              {fight.jouries.map(jury => (
                                  <JuryRow juryId={jury} key={jury} defaultScore={playerLine.scores.find(score=>score.jury === jury)?.value}/>
                              ))}
                            </UsersProviderWrapper>
                            </tbody>
                          </table>
                          <button className="bg-black/20 my-2 mx-2 cursor-pointer" type="submit">Сохранить оценки</button>
                        </form>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>

              ))}
              </Accordion.Root>
            </div>
          </div>
        </>

      )}
    </div>
  )
}

function PlusIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z"/>
    </svg>
  );
}

function JuryRow({juryId, defaultScore=0}: { juryId: number, defaultScore?: number }) {
  const {data: jury, isLoading} = useGetUserByIdQuery({id: juryId});
  return (
    <>
      {isLoading && <Loading/>}
      {jury &&
          <tr className="flex justify-between w-full">
              <th  className="border border-border w-full"  scope="col">{jury.secondName} {jury.firstName} {jury.thirdName}</th>
              <th className="border border-border w-full"  scope="col"><input className="w-full" type="number" defaultValue={defaultScore}/></th>
          </tr>
      }
    </>

  )
}