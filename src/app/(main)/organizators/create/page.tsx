"use client"
import TournamentCard from "@/components/tournaments/TournamentCard"
import { useCallback, useEffect, useState } from "react"
import { FightContainerCard, TournamentCardInterface, TournamentCreationRequest } from "@/types/TournamentsAPI"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { debounce } from "next/dist/server/utils"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import {redirect, useRouter} from "next/navigation"
import TournamentInformationConstructor from "@/components/organizator/TournamentInformationConstructor"
import Loading from "@/app/loading"
import FightsInformations from "@/components/organizator/FightsInformations"
import Link from "next/link"
import MaterialsProviderWrapper from "@/api/materials/ClientWrapper"
import PickProblemsForTournament from "@/components/organizator/PickProblemsForTournament"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import FilesProviderWrapper from "@/api/files/ClientWrapper";
import {useAddTournamentMutation} from "@/api/tournaments/clientApiInterface";

export interface TournamentCardCallback {
  (card: Partial<TournamentCreationRequest>): void
}

export default function CreateTournamentPage() {
  const rights = useAppSelector((state) => state.auth.authInfo?.rights)
  const isOrganizator = (rights ?? []).filter((r) => r.right_flag === "CREATE_TOURNAMENTS").length !== 0
  const router = useRouter()
  const token = useAppSelector(state => state.auth.token)
  const [newTournamentCardResponse, setNewTournamentCardResponse] = useState<TournamentCreationRequest>({
    token: token,
    title: "",
    description: "",
    main_image: "", 
    tournament_logo: "",
    start_timestamp: 1,
    end_timestamp: 1,
    year: 1,
    location: "",
    location_lat: 0,
    location_lon: 0,
    tournament_type: 1,
    problems: [],
    fight_containers: [],
    materials: []
  })
  const [createTournament, {data: newTournament, isLoading, isSuccess, error}] = useAddTournamentMutation()
    useEffect(() => {
        if (!isLoading && isSuccess){
            redirect(`/tournaments/${newTournament?.id}/info/about`)
        }
        else{
            console.log("End of creating:", error)
        }
    }, [isLoading]);

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const updateTournamentHandler = useCallback(
    debounce((updates: Partial<TournamentCreationRequest>) => {
      console.log("Updates", updates)
      setNewTournamentCardResponse((prev) => ({
        ...prev,
        ...updates,
      }))
    }, 500),
    [],
  )


  if (!rights || !isMounted) {
    return <Loading />
  }

  if (!isOrganizator) {
    router.push("/login")
  }

  return (
    <div className="text-text-main flex flex-col gap-2 py-2">
        {isLoading && <h1>Типо загрузка (потом красиво оформим)</h1>}
        <FilesProviderWrapper>
            <TournamentCard
                isExtended={true}
                isCreate={true}
                onUpdateCreate={updateTournamentHandler}
            />
        </FilesProviderWrapper>

      <div className="bg-bg-alt min-h-30 w-full rounded-3xl px-5 py-2">
        <MaterialsProviderWrapper>
          <TournamentInformationConstructor />
        </MaterialsProviderWrapper>
      </div>
      <div className="bg-bg-alt min-h-30 w-full rounded-3xl px-5 py-2">
        <FightsInformations update={updateTournamentHandler} />
      </div>
      <div className="bg-bg-alt min-h-30 w-full rounded-3xl px-5 py-2">
        <ProblemsProviderWrapper>
          <PickProblemsForTournament year={newTournamentCardResponse.year} onUpdateCreate={updateTournamentHandler}/>
        </ProblemsProviderWrapper>
        
      </div>
      <div className="bg-bg-alt flex h-fit w-full items-center justify-between rounded-3xl px-5 py-3">
        <Link
          href="/organizators"
          className="flex h-[2.5rem] w-50 items-center justify-center rounded-2xl border border-[#ED0F4E] bg-[#ED0F4E]/20 text-center text-[#ED0F4E] hover:bg-[#ED0F4E]/50"
        >
          Отмена
        </Link>
        <button className="bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary h-[2.5rem] w-50 cursor-pointer rounded-2xl border"
            onClick={()=>{
                console.log("clicked", newTournamentCardResponse)
                createTournament({
                    tournamentObject: newTournamentCardResponse
                })
            }}
        >
          Создать
        </button>
      </div>
    </div>
  )
}
