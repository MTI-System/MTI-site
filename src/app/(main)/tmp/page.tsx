"use client"
import {
  useGetActionInformationQuery,
  useGetFightInformationQuery,
  useGetTeamInTournamentQuery,
} from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import { useEffect, useState } from "react"
import * as React from 'react';
import { Collapsible } from '@base-ui-components/react/collapsible'

export function YearCollapsible({year, setYR}:{year:number, setYR:(param: number)=>void}) {
  return (
    <Collapsible.Root className="flex min-h-36 w-56 flex-col justify-center text-gray-900">
      <Collapsible.Trigger className="group flex items-center gap-2 rounded-sm bg-gray-100 px-2 py-1 text-sm font-medium hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 active:bg-gray-200">
        <ChevronIcon className="size-3 transition-all ease-out group-data-[panel-open]:rotate-90" />
        {year}
      </Collapsible.Trigger>
      <Collapsible.Panel className="flex [&[hidden]:not([hidden='until-found'])]:hidden h-[var(--collapsible-panel-height)] flex-col justify-end overflow-hidden text-sm transition-all ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 duration-150">
        <div className="mt-1 flex cursor-text flex-col gap-2 rounded-sm bg-gray-100 py-2 pl-7">
          <div>
            <button onClick={() =>(setYR(2024))} className="hover:bg-gray-200 active:bg-gray-400">2024</button>
          </div>

          <div>
            <button onClick={() =>(setYR(2025))} className="hover:bg-gray-200 active:bg-gray-400" >2025</button>
          </div>

          <div>
            <button onClick={() =>(setYR(2026))} className="hover:bg-gray-200 active:bg-gray-400">2026</button>
          </div>
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
export function TtCollapsible({tt, setTT}:{tt:number, setTT:(param: number)=>void}) {
  return (
    <Collapsible.Root className="flex min-h-36 w-56 flex-col justify-center text-gray-900">
      <Collapsible.Trigger className="group flex items-center gap-2 rounded-sm bg-gray-100 px-2 py-1 text-sm font-medium hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 active:bg-gray-200">
        <ChevronIcon className="size-3 transition-all ease-out group-data-[panel-open]:rotate-90" />
        {tt==1 ? "тюе": "тюф"}
      </Collapsible.Trigger>
      <Collapsible.Panel className="flex [&[hidden]:not([hidden='until-found'])]:hidden h-[var(--collapsible-panel-height)] flex-col justify-end overflow-hidden text-sm transition-all ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 duration-150">
        <div className="mt-1 flex cursor-text flex-col rounded-sm bg-gray-100 overflow-hidden">
            <button onClick={() =>(setTT(1))} className="py-1 hover:bg-gray-400">тюе</button>
            <button onClick={() =>(setTT(2))} className="py-1 hover:bg-gray-400" >тюф</button>

        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export function ChevronIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M3.5 9L7.5 5L3.5 1" stroke="currentcolor" />
    </svg>
  );
}


export default function Page() {
  return (
    <TournamentsProviderWrapper>
      <QueryTest />
    </TournamentsProviderWrapper>
  )
}

function QueryTest() {
  const { data, isLoading, error, isSuccess } = useGetFightInformationQuery({ fightId: 1 })
  const {
    data: actionData,
    isLoading: actionLoading,
    error: actionError,
    isSuccess: actionSuccess,
  } = useGetActionInformationQuery({ actionId: 1 })
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
    isSuccess: teamSuccess,
  } = useGetTeamInTournamentQuery({ teamId: 1 })

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-500">Fight Information</p>
      <p>{JSON.stringify(data)}</p>
      <p className="text-sm text-gray-500">Action Information</p>
      <p>{JSON.stringify(actionData)}</p>
      <p className="text-sm text-gray-500">Team Information</p>
      <p>{JSON.stringify(teamData)}</p>
    </div>
  )
}
