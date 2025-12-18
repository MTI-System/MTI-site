"use client"
import {
  useGetActionInformationQuery,
  useGetFightInformationQuery,
  useGetTeamInTournamentQuery,
} from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

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
    <>
    {error && <div>Ошибка загрузки задач: {JSON.stringify(error)}</div>}
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-500">Fight Information</p>
      <p>{JSON.stringify(data)}</p>
      <p className="text-sm text-gray-500">Action Information</p>
      <p>{JSON.stringify(actionData)}</p>
      <p className="text-sm text-gray-500">Team Information</p>
      <p>{JSON.stringify(teamData)}</p>
    </div>
    </>
  )
}
