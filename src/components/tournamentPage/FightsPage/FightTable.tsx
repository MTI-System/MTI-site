"use client"
import { Accordion } from "@base-ui-components/react"
import FightRoomTable from "./FightRoomTable";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import {
  useGetFightContainerCardQuery,
  useGetFightContainerInfoQuery,
  useGetFightInfoByTournamentQuery
} from "@/api/tournaments/clientApiInterface";
import { useParams } from "next/navigation";
import {FightContainerInfoInterface, FightInformationInterface} from "@/types/TournamentsAPI";
import Loading from "@/app/loading";

export interface EventData {
  actions: number[];
  is_location_link: boolean;
  location: string;
  startTime: number;
  jouries: number[];
  teams: Array<{
    id: number;
    name: string;
    score: number;
    coefficient: number;
  }>;
}

export default function FightTable({ type }: { type: 'jury' | 'team' }) {
    const { id } = useParams();
    const { data: fightData, isLoading: fightIsLoading, error, isSuccess } = useGetFightInfoByTournamentQuery({ tournamentId: Number(id) })

    return (
        <TournamentsProviderWrapper>
            <UsersProviderWrapper>
                <Accordion.Root multiple className="flex w-full flex-col gap-2.5 justify-center text-text-main">
                    {Object.entries(fightData ?? {}).map(([fightNum, fight]) =>
                        fight.length > 0 && <FightScheduleTable  key={fightNum} type={type} fight={fight} fightNum={fightNum}/>
                    )}
                </Accordion.Root>
            </UsersProviderWrapper>
        </TournamentsProviderWrapper>
    )
}

function FightScheduleTable({type, fightNum, fight}: {fight: FightContainerInfoInterface, type: 'team' | 'jury' , fightNum: string}){
  const {data: fightContainerInfo, isLoading: isFightContainerInfoLoading, isSuccess: isFightContainerInfoLoaded, isError} = useGetFightContainerCardQuery({id: Number(fightNum)})
  return (
    <>
      {isFightContainerInfoLoaded ? <Accordion.Item className="md:border md:rounded-xl md:border-border overflow-hidden">
        <Accordion.Header>
          <Accordion.Trigger
            className="group cursor-pointer border rounded-xl border-border md:border-none relative flex w-full items-baseline justify-between gap-4 bg-bg-alt py-2 pr-1 pl-3 font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
            <div className="flex justify-center w-full ml-7">{fightContainerInfo?.title}</div>
            <PlusIcon
              className="mr-2 size-3 shrink-0 transition-all ease-out group-data-panel-open:scale-110 group-data-panel-open:rotate-45"/>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel
          className="h-(--accordion-panel-height) overflow-hidden text-base text-text-main transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0">
          <div className="flex justify-center">
            <FightRoomTable fight={fight} type={type}></FightRoomTable>
          </div>
        </Accordion.Panel>
      </Accordion.Item> : isFightContainerInfoLoading ? <Loading/> : isError? <p>Ошибка загрузки названия</p> : <p>Неизвестная ошибка</p>}

    </>
  )
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
            <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
        </svg>
    );
}