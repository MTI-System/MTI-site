"use client"
import { useAddFightMutation, useGetFightInfoByTournamentQuery } from "@/api/tournaments/clientApiInterface"
import Loading from "@/app/loading"
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin"
import { Accordion } from "@base-ui-components/react"
import FightContainerAdminPanel from "@/components/tournamentPage/adminPanel/FightContainerAdminPanel"
import { useRouter } from "next/navigation"

export default function AdminPanel({ tournamentId }: { tournamentId: number }) {
  const {
    data: informationAboutFights,
    isLoading,
    isError,
  } = useGetFightInfoByTournamentQuery({ tournamentId: tournamentId })
  const router = useRouter()
  const mockTeams = [
    { id: 1, label: "Команда 1" },
    { id: 2, label: "Команда 2" },
    { id: 3, label: "Команда 3" },
    { id: 4, label: "Команда 4" },
    { id: 5, label: "Команда 5" },
    { id: 6, label: "Команда 6" },
    { id: 7, label: "Команда 7" },
    { id: 8, label: "Команда 8" },
    { id: 9, label: "Команда 9" },
  ]
  return (
    <>
      {isLoading && <Loading />}
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Название команды</th>
          </tr>
        </thead>
        <tbody>
          {mockTeams.map((team) => (
            <tr key={team.id}></tr>
          ))}
        </tbody>
      </table>

      {/* {isError && <p>Ошибка aaa{tournamentId}</p>}
      {informationAboutFights && (
        <>
          <Accordion.Root className="flex w-full flex-col justify-center text-gray-900">
            {Object.entries(informationAboutFights ?? {}).map(([fightContainerId, fightsInfo]) => (
              <FightContainerAdminPanel
                key={fightContainerId}
                fightContainerId={Number(fightContainerId)}
                fightsInfo={fightsInfo}
                tournamentId={tournamentId}
              />
            ))}
          </Accordion.Root>
        </>
      )} */}
    </>
  )
}
