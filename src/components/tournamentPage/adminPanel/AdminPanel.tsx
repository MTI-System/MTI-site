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
  return (
    <>
      {isLoading && <Loading />}
      {isError && <p>Ошибка aaa{tournamentId}</p>}
      {informationAboutFights && (
        <>
          {/*<button className="bg-black/20 my-2 mx-2 cursor-pointer" onClick={()=>{*/}
          {/*  router.refresh()*/}
          {/*}}>Обновить</button>*/}
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
      )}
    </>
  )
}
