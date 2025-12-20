"use client"
import {
  useGetActionInformationQuery,
  useGetFightInfoByTournamentQuery,
  useGetFightInformationQuery,
  useGetTeamInTournamentQuery,
  useGetFightContainerInfoQuery
} from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import { useEffect, useState } from "react"

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
  const {
    data: fightData,
    isLoading: fightLoading,
    error: fightError,
    isSuccess: fightSuccess,
  } = useGetFightInfoByTournamentQuery({ tournamentId: 119 })
  const {
    data: fightContainerData,
    isLoading: fightContainerLoading,
    error: fightContainerError,
    isSuccess: fightContainerSuccess,
  } = useGetFightContainerInfoQuery({fightContainerId: 128})

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-500">Fight Information</p>
      <p>{JSON.stringify(data)}</p>
      <p className="text-sm text-gray-500">Action Information</p>
      <p>{JSON.stringify(actionData)}</p>
      <p className="text-sm text-gray-500">Team Information</p>
      <p>{JSON.stringify(teamData)}</p>
      <p className="text-sm text-gray-500">Fight Information</p>
      <p>{JSON.stringify(fightData)}</p>
      <p className="text-sm text-gray-500">Fight Container</p>
      <p>{JSON.stringify(fightContainerData)}</p>
    </div>
  )
}
