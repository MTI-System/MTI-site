"use client"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { TeamInTournamentInterface } from "@/types/TournamentsAPI"
import { Avatar } from "@base-ui-components/react"

import { UserAvatarWithTitleByID } from "@/components/ui/Avatars"

export default function TeamInTournamentPage({ mainData }: { mainData: TeamInTournamentInterface }) {
  return (
    <div className=" ">
      <div className=" ">
        <CommandCell mainData={mainData} />
      </div>

      <hr className="border-border w-full border-t" />

      <UsersProviderWrapper>
        <div className="flex flex-wrap items-center justify-center gap-4 p-6">
          <UserAvatarWithTitleByID
            PeoplesIDs={mainData.players}
            changeclassNameAvatar="inline-flex items-center  justify-center overflow-hidden rounded-full size-28 sm:size-28 text-xl"
            changeclassNameTextUnderAvatar="text-xl p-7 "
          />
        </div>
      </UsersProviderWrapper>
    </div>
  )
}

function CommandCell({ mainData }: { mainData: TeamInTournamentInterface }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-10 font-bold">
      <CommandMainAvatar CommandName={mainData.name} />
      <h1 className="text-text-main flex flex-col gap-2 text-4xl">{mainData.name}</h1>
    </div>
  )
}

function CommandMainAvatar({ CommandName }: { CommandName: string }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <Avatar.Root className="bg-hover text-text-main mx-20 mb-2 flex size-40 flex-col items-center justify-center overflow-hidden rounded-full align-middle text-base font-medium uppercase select-none sm:size-40">
        <Avatar.Image className="size-full object-cover" />
        <Avatar.Fallback className="flex size-full items-center justify-center text-3xl">
          {CommandName[0]}
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  )
}
