import {
  useGetActionInformationQuery,
  useGetFightInformationQuery,
  useGetTeamInTournamentQuery,
} from "@/api/tournaments/clientApiInterface"

import { Tabs } from '@base-ui-components/react/tabs';
import { FightCard } from "./FightList";

// export default function Fight(){
//     return(
//         <>
//         <h1 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main">Действия боя</h1>
//         <FightCard />

//         <ExampleTabs/>
//         </>
//     )
// }

export function ExampleTabs() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List className="mt-6 relative z-0 flex gap-1 px-1 justify-center items-center">
        <Tabs.Tab
          className="flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-gray-600 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 hover:text-gray-900 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline focus-visible:before:outline-2 data-[active]:text-gray-900"
          value="overview"
        >
          Действие 1
        </Tabs.Tab>
        <Tabs.Tab
          className="flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-gray-600 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 hover:text-gray-900 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline focus-visible:before:outline-2 data-[active]:text-gray-900"
          value="projects"
        >
          Действие 2
        </Tabs.Tab>
        <Tabs.Tab
          className="flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-gray-600 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 hover:text-gray-900 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline focus-visible:before:outline-2 data-[active]:text-gray-900"
          value="account"
        >
          Действие 3
        </Tabs.Tab>
        <Tabs.Indicator className="absolute top-1/2 left-0 z-[-1] h-6 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] -translate-y-1/2 rounded-sm bg-gray-100 transition-all duration-200 ease-in-out" />
      </Tabs.List>
      <Tabs.Panel
        className="relative flex h-32 items-center justify-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2"
        value="overview"
      >
        <FightAction/>
      </Tabs.Panel>
      <Tabs.Panel
        className="relative flex h-32 items-center justify-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2"
        value="projects"
      >
        <FightAction/>
      </Tabs.Panel>
      <Tabs.Panel
        className="relative flex h-32 items-center justify-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2"
        value="account"
      >
        <FightAction/>
      </Tabs.Panel>
    </Tabs.Root>
  );
}

const teams = [//for exampl
    {
      "id": 1,
      "name": "Команда 1",
      "player": "a",
    },
    {
      "id": 2,
      "name": "Команда 2",
      "player": "b",
    },
    {
      "id": 3,
      "name": "Команда 3",
      "player": "c",
    }
  ]
const problem =6
export function FightAction(){
    return(
<div className="flex mt-30 flex-row w-full">
  <div className="w-32 border-border flex flex-col items-center justify-center p-4">
    <span className="text-xs font-medium text-text-alt uppercase mb-2 text-center">
      Задача
    </span>
    <code className="text-lg font-bold font-mono text-text-main">
      {problem}
    </code>
  </div>

  <div className="flex-1">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border ">
          <th className="px-6 py-3 text-center text-sm font-medium text-text-main">
            Название команды
          </th>
          <th className="px-6 py-3 text-center text-sm font-medium text-text-main">
            Игрок
          </th>
        </tr>
      </thead>

      <tbody>
        {teams.map((team) => (
          <tr key={team.id} className="hover:bg-hover border-b border-border last:border-b-0">
            <td className="px-6 py-4 text-center text-sm text-text-main">{team.name}</td>
            <td className="px-6 py-4 text-center text-sm text-text-main">{team.player}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    )
}