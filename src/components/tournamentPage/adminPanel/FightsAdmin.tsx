import {
  FightInformationInterface,
  FightTeamInTournamentInterface,
  TeamInTournamentInterface,
  teamInTournamentSchema
} from "@/types/TournamentsAPI";
import {Accordion, Form, Select} from "@base-ui-components/react";
import ActionAdmin from "@/components/tournamentPage/adminPanel/ActionAdmin";
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper";
import {
  useGetTournamentTableQuery, useSetJuryToFightMutation,
  useSetLinkAndTimestampToFightMutation,
  useSetTeamsToFightMutation
} from "@/api/tournaments/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";


export function tsMsToHHMM(tsMs: number): string {
  const d = new Date(tsMs);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function hhmmToTsMs(hhmm: string, baseTsMs: number): number {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) throw new Error(`Bad time format: "${hhmm}"`);

  const hh = Number(m[1]);
  const mm = Number(m[2]);

  const d = new Date(baseTsMs);
  d.setHours(hh, mm, 0, 0);
  return d.getTime();
}

export default function FightsAdmin(
  {fight, idx, tournamentId}: {fight: FightInformationInterface, idx: number, tournamentId: number}){
  const {data: fullTableObject, refetch} = useGetTournamentTableQuery({id: tournamentId})
  const token = useAppSelector(state=>state.auth.token)
  const teams = fullTableObject?.table_lines.map(l => {
    return {
      label: l.team_name,
      value: l.team_id.toString(),
    }
  })
  const [addTimestampAndLink, {isLoading: idAddingLoading, isSuccess: idAddingSuccess}] = useSetLinkAndTimestampToFightMutation()
  const [setTeamsToFight, {isLoading: isTeamsSettingLoading, isSuccess: idTeamsSettingSuccess}] = useSetTeamsToFightMutation()
  const [setJuryToFight] = useSetJuryToFightMutation()
  useEffect(() => {
    if (idAddingSuccess) {
      refetch()
    }
  }, [idAddingSuccess]);
  useEffect(() => {
    if (idTeamsSettingSuccess) {
      refetch()
    }
  }, [idTeamsSettingSuccess]);
  return (
    <>

      <Accordion.Root className="flex w-full flex-col justify-center text-gray-900 px-3">
        <Accordion.Item className="border border-border">
          <Accordion.Header>
            <Accordion.Trigger className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-alt py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
              <p className="text-text-main">Комната {idx + 1} {fight.id}</p>
              <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45 text-text-main" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
            <div className="px-2">
              <form className="" onSubmit={(e)=>{
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                form.set("token", token)
                //@ts-ignore
                form.set("fightId", fight.id)
                const data = Object.fromEntries(form.entries());
                const hhmm = String(data.timestamp);           // "09:33"
                (data as any).timestamp = hhmmToTsMs(hhmm, fight.startTime); // ms
                //@ts-ignore
                addTimestampAndLink(data)
                console.log(data)
              }}>
                <div className="flex gap-2">
                  <p>Ссылка на комнату: </p>
                  <input type="url" name={"link"} defaultValue={fight.location}/>
                </div>
                <div className="flex gap-2">
                  <p>Время начала: </p>
                  <input type="time" name={"timestamp"} defaultValue={tsMsToHHMM(fight.startTime)}/>
                </div>
                <button type="submit" className="bg-black/20 cursor-pointer">Сохранить изменения</button>
              </form>

              <div>
                <p className="px-2 mt-2 font-bold">Команды в этой комнате</p>
                <form onSubmit={(e)=>{
                  e.preventDefault()
                  const form = new FormData(e.currentTarget)
                  const newForm = new FormData()
                  const data = Object.fromEntries(form.entries());

                  const teamsArr = [data.team1, data.team2]
                  if (data.team3 !== "") {
                    teamsArr.push(data.team3)
                  }

                  newForm.set("token", token)

                  newForm.set("fightId", fight.id.toString())
                  const finalData = Object.fromEntries(newForm.entries());
                  //@ts-ignore
                  finalData.teams = teamsArr
                  console.log(finalData);
                  //@ts-ignore
                  setTeamsToFight(finalData)
                }}>
                  <table>
                    <tbody>
                    <tr>
                      <th className="flex justify-between">

                          <p>Команда 1<br/>(первый доклад)</p>
                          <TeamsPicker name={"team1"} defaultValue={fight.teams[0]?.id?.toString()} teams={teams ?? []}/>

                          <p>Команда 2<br/>(первое оппонирование)</p>
                          <TeamsPicker name={"team2"} defaultValue={fight.teams[1]?.id?.toString()} teams={teams ?? []}/>

                          <p>Команда 3<br/>(первое рецензирование)</p>
                          <TeamsPicker name={"team3"} defaultValue={fight.teams[2]?.id?.toString()} teams={teams ?? []}/>

                      </th>

                    </tr>
                    </tbody>
                  </table>
                  <button className="bg-black/20 my-2 mx-2 cursor-pointer" type="submit">Сохранить команды</button>
                </form>
                <form onSubmit={(e)=>{
                  e.preventDefault();
                  const form = new FormData(e.currentTarget)
                  const juries = form.get("juries")?.toString().split(",").map(j=>Number(j))
                  setJuryToFight({
                    juries: juries ?? [],
                    fightId: fight.id,
                    token: token,
                  })
                }}>
                  <div >
                    <p>Список жюри:</p>
                    //@ts-ignore
                    <input defaultValue={fight.jouries.map((a)=>"" + a)} name="juries" type="text" placeholder="перечислите жюри через запятую без пробела" className="border-border"/>
                    <button className="bg-black/20 my-2 mx-2 cursor-pointer" type="submit">Сохранить жюри</button>
                  </div>

                </form>
              </div>


              {fight.actions.map((action, index) => (
                <ProblemsProviderWrapper key={action}>
                  <ActionAdmin actionId={action} idx={index} fight={fight}/>
                </ProblemsProviderWrapper>
              ))}
            </div>

          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </>
  )
}


function TeamsPicker(
  {name, defaultValue, teams}: {name: string, defaultValue?: string, teams: {
    label: string,
      value: string
    }[]}
){
  const [pickedTeam, setPickedTeam] = useState<string | undefined>(defaultValue)

  return (
    <Select.Root items={teams} onValueChange={(selected)=>{
      console.log(selected)
      setPickedTeam(selected ?? "")
    }}
     value={pickedTeam ?? ""}>
      <input name={name} value={pickedTeam ?? ""} onChange={()=>{}} className="hidden"/>
      <Select.Trigger className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base bg-[canvas] text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100">
        <Select.Value />
        <Select.Icon className="flex">
          <ChevronUpDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="outline-none select-none z-10" sideOffset={8}>
          <Select.Popup className="group min-w-[var(--anchor-width)] origin-[var(--transform-origin)] bg-clip-padding rounded-md bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
            <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute data-[side=none]:before:top-[-100%] before:left-0 before:h-full before:w-full before:content-['']" />
            <Select.List className="relative py-1 scroll-py-6 overflow-y-auto max-h-[var(--available-height)]">
              {teams.map(({ label, value }) => (
                <Select.Item
                  key={label}
                  value={value}
                  className="grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                >
                  <Select.ItemIndicator className="col-start-1">
                    <CheckIcon className="size-3" />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] bottom-0 data-[side=none]:before:bottom-[-100%]" />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}


function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}
function ChevronUpDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}