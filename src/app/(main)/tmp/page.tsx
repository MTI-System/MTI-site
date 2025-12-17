"use client"
import {
  useGetActionInformationQuery,
  useGetFightInformationQuery,
  useGetTeamInTournamentQuery,
} from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import { Avatar, Button, Combobox, Form } from "@base-ui-components/react"
import { useEffect, useId, useState } from "react"

export default function Page() {

  return (
    
    <div className=" ">
      <div className="flex  items-center gap-4   ">

       <MainAvatar />
      <h1>Название команды</h1>
    <Button className="flex items-center justify-center h-10 px-3.5 m-0 outline-0 border border-gray-200 rounded-md bg-gray-50 font-inherit text-base font-medium leading-6 text-gray-900 select-none hover:data-[disabled]:bg-gray-50 hover:bg-gray-100 active:data-[disabled]:bg-gray-50 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] active:border-t-gray-300 active:data-[disabled]:shadow-none active:data-[disabled]:border-t-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1 data-[disabled]:text-gray-500">
      На глобальную
    </Button>
    </div>
  
    <div className="flex items-center gap-4">

      <div>
    <MainAvatar />
    <h1 className="text-center">tn1r</h1>
      </div>
      <div>
    <MainAvatar />
    <h1 className="text-center">zweih</h1>
      </div>
      <div>
    <MainAvatar />
    <h1 className="text-center">shiro</h1>
      </div>
      <div>
    <MainAvatar />
    <h1 className="text-center">Choper</h1>
      </div>
      <div>
    <MainAvatar />
    <h1 className="text-center">Donk</h1>
      </div>
    </div>

    </div>
  )
}

function MainAvatar() {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Avatar.Root className="inline-flex size-19 items-center justify-center overflow-hidden rounded-full bg-gray-100 align-middle text-base font-medium text-black select-none">
        <Avatar.Image
          //src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
          width="48"
          height="48"
          className="size-full object-cover"
        />
        <Avatar.Fallback className="flex size-full items-center justify-center text-base">
          LT
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
