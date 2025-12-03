"use client"
import { FaTimes } from "react-icons/fa"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { EmbeddingCard } from "@/components/materials/FileEmbeddings"
import { MdOutlineRefresh } from "react-icons/md"
import { MdOutlineClose } from "react-icons/md"
import axios from "axios"
import { FILES_API } from "@/constants/APIEndpoints"
import { PendingInterface } from "@/components/organizator/TournamentInformationConstructor"

import TournamentCard from "@/components/tournaments/TournamentCard"
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { TournamentCreationRequest, TournamentCreationRequestSchema } from "@/types/TournamentsAPI"
import { debounce } from "next/dist/server/utils"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { redirect, useRouter } from "next/navigation"
import TournamentInformationConstructor, {
  MaterialsStateBaseType,
} from "@/components/organizator/TournamentInformationConstructor"
import Loading from "@/app/loading"
import FightsInformations from "@/components/organizator/FightsInformations"
import Link from "next/link"
import MaterialsProviderWrapper from "@/api/materials/ClientWrapper"
import PickProblemsForTournament from "@/components/organizator/PickProblemsForTournament"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import FilesProviderWrapper from "@/api/files/ClientWrapper"
import { useAddTournamentMutation } from "@/api/tournaments/clientApiInterface"
import {Popover, Toast} from "@base-ui-components/react"
import ColoredTType from "@/components/ui/ColoredTType";
import {TournamentTypeIntarface} from "@/types/TournamentTypeIntarface";


export default function CreateTournamentForm({tt}: {tt: TournamentTypeIntarface}) {
  const toastManager = Toast.useToastManager()

  const materialsState = useState<MaterialsStateBaseType>([])
  const materials = materialsState[0]
  const [pendingLoadingIDs, setPendingLoadingIDs] = useState<number[]>([])
  const isValidatedRef = useRef<boolean>(false)

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
    tournament_type: tt.id,
    problems: [],
    fight_containers: [],
    materials: [],
  })
  const [createTournament, { data: newTournament, isLoading, isSuccess, error }] = useAddTournamentMutation()
  useEffect(() => {
    console.log("new tournament", newTournament, isLoading, isSuccess)
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
  useEffect(() => {
    console.log("pendingLoadingIDs", pendingLoadingIDs)
    if (pendingLoadingIDs.length === 0 && isValidatedRef.current) {
      createTournament({ tournamentObject: newTournamentCardResponse })
    }
  }, [pendingLoadingIDs])

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
      <div className="flex gap-2 bg-bg-alt rounded-3xl px-5 py-5 text-xl">
        <p>Создание турнира типа </p>
        <ColoredTType ttName={tt.name} ttColor={tt.color}/>
        <p>({tt.longName})</p>
        <Popover.Root>
          <Popover.Trigger className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-popup-open:bg-gray-100">
            <div className="aspect-square h-full">?</div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align={"end"}>
              <Popover.Popup className="origin-(--transform-origin) rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                <Popover.Title className="text-base font-medium">
                  Тип турнира зафиксирован
                </Popover.Title>
                Для изменения типа турира необходимо выбрать его наверху страницы и перезайти на эту страницу создания турнира.

              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="bg-bg-alt min-h-30 w-full rounded-3xl px-5 py-2">
        {pendingLoadingIDs.length === 0 && (
          <MaterialsProviderWrapper>
            <TournamentInformationConstructor materialsState={materialsState} />
          </MaterialsProviderWrapper>
        )}
        {pendingLoadingIDs.length > 0 && (
          <div>
            <p>Загрузка материалов...</p>
            {materials.map((material: PendingInterface) =>
              material.pendingContent instanceof File ? (
                <LoadingFileEmbedding
                  key={material.id}
                  file={material.pendingContent}
                  token={token}
                  displayTitle={material.pendingTitle ?? ""}
                  onUploadComplete={(filename) => {
                    const matIdx = newTournamentCardResponse.materials.findIndex(
                      (m) => m.content === material.id.toString(),
                    )
                    if (matIdx !== -1) {
                      setNewTournamentCardResponse((prev) => ({
                        ...prev,
                        materials: prev.materials.map((m, i) => (i === matIdx ? { ...m, content: filename } : m)),
                      }))
                      setPendingLoadingIDs((prev) => prev.filter((id) => id !== material.id))
                    } else console.error("Material not found in tournament materials")
                  }}
                  onUploadCancel={(noWait) => {
                    if (!noWait) return
                    const matIdx = newTournamentCardResponse.materials.findIndex(
                      (m) => m.content === material.id.toString(),
                    )
                    if (matIdx !== -1) {
                      setNewTournamentCardResponse((prev) => ({
                        ...prev,
                        materials: prev.materials.filter((m, i) => i !== matIdx),
                      }))
                      setPendingLoadingIDs((prev) => prev.filter((id) => id !== material.id))
                    } else console.error("Material not found in tournament materials")
                  }}
                />
              ) : (
                <></>
              ),
            )}
          </div>
        )}
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
          materials={materials}
          createTournament={(tournament) => {
            setPendingLoadingIDs((prev) => [
              ...materials.filter((m: PendingInterface) => m.pendingContent instanceof File).map((m) => m.id),
            ])
            isValidatedRef.current = true
            setNewTournamentCardResponse(tournament.tournamentObject)
          }}
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
                        materials,
                        createTournament,
                        setErrors,
                      }: {
  newTournamentCardResponse: TournamentCreationRequest
  materials: MaterialsStateBaseType
  createTournament: ({ tournamentObject }: { tournamentObject: TournamentCreationRequest }) => void
  setErrors: (errors: { key: string; message: string }[]) => void
}) {
  const toastManager = Toast.useToastManager()

  return (
    <button
      className="bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary h-10 w-50 cursor-pointer rounded-2xl border"
      onClick={() => {
        console.log("clicked", newTournamentCardResponse)
        newTournamentCardResponse.materials = materials.map((material: PendingInterface) => ({
          title: material.pendingTitle!!,
          content:
            material.pendingContent instanceof File ? material.id.toString() : (material.pendingContent ?? undefined),
          content_type: material.content_type?.id!!,
          is_external: material.pendingMetadata?.is_external === "true",
          file_size: material.pendingMetadata?.file_size,
        }))
        const parsed = TournamentCreationRequestSchema.safeParse(newTournamentCardResponse)
        if (!parsed.success) {
          console.error("Invalid tournament creation request", parsed.error.issues)

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

function LoadingFileEmbedding({
                                file,
                                token,
                                displayTitle,
                                onUploadComplete,
                                onUploadCancel,
                              }: {
  file: File
  token: string
  displayTitle: string
  onUploadComplete: (filepath: string) => void
  onUploadCancel: (noWait: boolean) => void
}) {
  const [isError, setIsError] = useState(false)
  const progresRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState<number>(0)
  const abortControllerRef = useRef<AbortController>(null)
  const formData = new FormData()
  formData.set("file", file)
  formData.set("token", token)

  const uploadFile = () => {
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    axios
      .post(FILES_API + "add_file", formData, {
        onUploadProgress: (event) => {
          if (!event.progress) return
          progresRef.current?.style.setProperty("--progress-shift", `${event.progress * 100 - 100}%`)
          setProgress(event.progress * 100)
        },
        signal: abortController.signal,
      })
      .then((data) => {
        if (data.status === 200) {
          progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
          progresRef.current?.style.setProperty("--progress-color", "#00FF00")
          onUploadComplete(data.data.filename)
        } else {
          console.error("File loaded with error")
          progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
          progresRef.current?.style.setProperty("--progress-color", "#FF0000")
          setIsError(true)
        }
      })
      .catch((error) => {
        console.error("File loaded with error", error)
        progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
        progresRef.current?.style.setProperty("--progress-color", "#FF0000")
        setIsError(true)
      })
  }

  useEffect(() => {
    uploadFile()
  }, [])

  return (
    <EmbeddingCard
      title={displayTitle}
      subtitle={isError ? "Ошибка" : `Загрузка: ${progress.toFixed(2)}%`}
      embeddingImageURL="/uploading.svg"
    >
      <div className="flex h-full items-center justify-center">
        {isError && (
          <MdOutlineRefresh
            className="hover:text-text-alt"
            onClick={() => {
              setIsError(false)
              uploadFile()
              progresRef.current?.style.setProperty("--progress-shift", `${-100}%`)
              progresRef.current?.style.setProperty("--progress-color", "var(--primary-accent)")
            }}
          />
        )}
        <MdOutlineClose
          className="hover:text-text-alt"
          onClick={() => {
            abortControllerRef.current?.abort()
            onUploadCancel(isError)
          }}
        />
      </div>
      <div
        className="absolute right-0 bottom-0 left-0 h-2 after:absolute after:bottom-0 after:left-(--progress-shift) after:h-2 after:w-full after:bg-(--progress-color) after:transition-all after:duration-250 after:ease-in-out after:content-['']"
        style={{ "--progress-shift": `${-100}%`, "--progress-color": "var(--primary-accent)" } as CSSProperties}
        ref={progresRef}
      ></div>
    </EmbeddingCard>
  )
}
