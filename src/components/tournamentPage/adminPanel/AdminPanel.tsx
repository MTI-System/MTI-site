"use client"
import {useGetFightInfoByTournamentQuery} from "@/api/tournaments/clientApiInterface";
import Loading from "@/app/loading";
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin";
import { Accordion } from "@base-ui-components/react";

export default function AdminPanel(
  {tournamentId}: { tournamentId: number }
){
  const {data: informationAboutFights, isLoading, isError} = useGetFightInfoByTournamentQuery({tournamentId: tournamentId});
  return (
    <>
      {isLoading && (<Loading/>)}
      {isError && (<p>Ошибка aaa{tournamentId}</p>)}
      {informationAboutFights && (
        <>
          <Accordion.Root className="flex w-full flex-col justify-center text-gray-900">
            {Object.entries(informationAboutFights ?? {}).map(([fightName, fightsInfo]) => (
                  <Accordion.Item className="border border-border" key={fightName}>
                    <Accordion.Header>
                      <Accordion.Trigger className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-alt py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                        <p className="text-text-main">{fightName}</p>
                        <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45 text-text-main" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                      <div >
                        {fightsInfo.map((fight, idx)=>(
                          <FightsAdmin key={fight.id} fight={fight} idx={idx} tournamentId={tournamentId}/>
                        ))}
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
            ))}
          </Accordion.Root>
        </>
      )}
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