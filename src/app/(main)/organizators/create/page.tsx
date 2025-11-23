"use client"
import TournamentCard from "@/components/tournaments/TournamentCard"
import { useCallback, useEffect, useState } from "react"
import { TournamentCreationRequest, TournamentCreationRequestSchema } from "@/types/TournamentsAPI"
import { debounce } from "next/dist/server/utils"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { redirect, useRouter } from "next/navigation"
import TournamentInformationConstructor from "@/components/organizator/TournamentInformationConstructor"
import Loading from "@/app/loading"
import FightsInformations from "@/components/organizator/FightsInformations"
import Link from "next/link"
import MaterialsProviderWrapper from "@/api/materials/ClientWrapper"
import PickProblemsForTournament from "@/components/organizator/PickProblemsForTournament"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import FilesProviderWrapper from "@/api/files/ClientWrapper"
import { useAddTournamentMutation } from "@/api/tournaments/clientApiInterface"
import { Toast } from "@base-ui-components/react/toast"
import { FaTimes } from "react-icons/fa"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type {Metadata} from "next";




export interface TournamentCardCallback {
  (card: Partial<TournamentCreationRequest>): void
}



export default function CreateTournamentPage() {
  return (
    <Toast.Provider limit={10}>
      <CreateTournamentForm />
    </Toast.Provider>
  )
}

function CreateTournamentForm() {
  const toastManager = Toast.useToastManager()

  const [errors, setErrors] = useState<{ key: string; message: string }[]>([])
  const rights = useAppSelector((state) => state.auth.authInfo?.rights)
  const isOrganizator = (rights ?? []).filter((r) => r.right_flag === "CREATE_TOURNAMENTS").length !== 0
  const router = useRouter()
  const token = useAppSelector((state) => state.auth.token)
  const [newTournamentCardResponse, setNewTournamentCardResponse] = useState<TournamentCreationRequest>({
    token: token,
    title: "",
    description: "",
    main_image: "bigImagePlaceholder.png",
    tournament_logo: "bigImagePlaceholder.png",
    start_timestamp: 0,
    end_timestamp: 0,
    year: 0,
    location: "",
    location_lat: undefined,
    location_lon: undefined,
    tournament_type: 1,
    problems: [],
    fight_containers: [],
    materials: [],
  })
  const [createTournament, { data: newTournament, isLoading, isSuccess, error }] = useAddTournamentMutation()
  useEffect(() => {
    if (!isLoading && isSuccess) {
      redirect(`/tournaments/${newTournament?.id}/info/about`)
    } else if (error) {
      console.log("End of creating:", error)
      toastManager.add({
        title: `Ошибка при создании турнира`,
        description: `Произошла неизвестная ошибка. Повторите попытку позже или обратитесь в поддержку.\n
        response code: ${(error as FetchBaseQueryError).status}`,
      })
    }
  }, [isLoading])

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
        <TournamentCard isExtended={true} isCreate={true} onUpdateCreate={updateTournamentHandler} errors={errors} />
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
          <PickProblemsForTournament
            year={newTournamentCardResponse.year}
            onUpdateCreate={updateTournamentHandler}
            errors={errors}
          />
        </ProblemsProviderWrapper>
      </div>
      <div className="bg-bg-alt flex h-fit w-full items-center justify-between rounded-3xl px-5 py-3">
        <Link
          href="/organizators"
          className="flex h-10 w-50 items-center justify-center rounded-2xl border border-[#ED0F4E] bg-[#ED0F4E]/20 text-center text-[#ED0F4E] hover:bg-[#ED0F4E]/50"
        >
          Отмена
        </Link>

        <SubmitButton
          newTournamentCardResponse={newTournamentCardResponse}
          createTournament={createTournament}
          setErrors={setErrors}
        />
        <Toast.Portal>
          <Toast.Viewport className="fixed top-auto right-4 bottom-4 z-10 mx-auto flex w-[250px] sm:right-8 sm:bottom-8 sm:w-[300px]">
            <ToastList />
          </Toast.Viewport>
        </Toast.Portal>
      </div>
    </div>
  )
}

function SubmitButton({
  newTournamentCardResponse,
  createTournament,
  setErrors,
}: {
  newTournamentCardResponse: TournamentCreationRequest
  createTournament: ({ tournamentObject }: { tournamentObject: TournamentCreationRequest }) => void
  setErrors: (errors: { key: string; message: string }[]) => void
}) {
  const toastManager = Toast.useToastManager()

  return (
    <button
      className="bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary h-10 w-50 cursor-pointer rounded-2xl border"
      onClick={() => {
        console.log("clicked", newTournamentCardResponse)
        const parsed = TournamentCreationRequestSchema.safeParse(newTournamentCardResponse)
        if (!parsed.success) {
          console.error("Invalid tournament creation request", parsed.error.issues)
          // setErrors(parsed.error.issues.map((issue) => ({ key: issue.path[0].toString(), message: issue.message })))
          // INSERT_YOUR_CODE
          // Remove issues with duplicate descriptions
          const uniqueIssues = parsed.error.issues.filter(
            (issue, index, self) => self.findIndex((i) => i.message === issue.message) === index,
          )
          setErrors(uniqueIssues.map((issue) => ({ key: issue.path[0].toString(), message: issue.message })))
          uniqueIssues.forEach((issue) => {
            toastManager.add({
              title: `Форма заполнена некорректно`,
              description: issue.message,
            })
          })
          return
        }
        createTournament({
          tournamentObject: parsed.data,
        })
      }}
    >
      Создать
    </button>
  )
}

function ToastList() {
  const { toasts, close } = Toast.useToastManager()
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-(--height) w-full origin-bottom transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-lg border-2 border-red-300 bg-gray-50 bg-clip-padding p-4 shadow-lg select-none [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-ending-style:opacity-0 data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-limited:opacity-0 data-starting-style:transform-[translateY(150%)] data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))] data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))] data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]"
    >
      <Toast.Content
        className="overflow-hidden transition-opacity duration-250 data-behind:pointer-events-none data-behind:opacity-0 data-expanded:pointer-events-auto data-expanded:opacity-100"
        onMouseDown={(e) => {
          if (e.button === 1) {
            e.preventDefault()
            close(toast.id)
          }
        }}
      >
        <Toast.Title className="py-2 text-[0.975rem] leading-5 font-medium" />
        <Toast.Description className="text-[0.925rem] leading-5 text-gray-700" />
        <Toast.Close
          className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded border-none bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ))
}
