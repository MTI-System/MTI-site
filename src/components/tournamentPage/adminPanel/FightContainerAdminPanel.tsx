import {Accordion} from "@base-ui-components/react";
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin";
import {FightInformationInterface} from "@/types/TournamentsAPI";
import {useAddFightMutation, useGetFightContainerCardQuery} from "@/api/tournaments/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";

export default function FightContainerAdminPanel(
  {fightsInfo, fightContainerId, tournamentId}:{fightContainerId: number, fightsInfo: FightInformationInterface[], tournamentId: number}
){
  const [addFight] = useAddFightMutation()
  const token = useAppSelector(state=>state.auth.token)
  const {data} = useGetFightContainerCardQuery({id: fightContainerId})
  return (
    <Accordion.Item className="border border-border" key={fightContainerId}>
      <Accordion.Header>
        <Accordion.Trigger className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-alt py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
          <p className="text-text-main">{data?.title ?? "loading"}</p>
          <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45 text-text-main" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">

        <div >
          {fightsInfo.map((fight, idx)=>(
            <FightsAdmin key={fight.id} fight={fight} idx={idx} tournamentId={tournamentId}/>
          ))}
        </div>

        <button className="bg-black/20 my-2 mx-2 cursor-pointer" onClick={()=>{
          addFight({
            token: token,
            fightContainerId: Number(fightContainerId)
          })
        }}>Добавить бой</button>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}