"use client"
import { TournamentCardInterface, TournamentCreationRequest } from "@/types/TournamentsAPI"
import { CiLocationOn } from "react-icons/ci"
import { CiClock2 } from "react-icons/ci"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import {JSX, useState, useRef, ChangeEvent, useEffect} from "react"
import clsx from "clsx"
import { GoPeople } from "react-icons/go"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import Loading from "@/app/loading"
import {  DateRange } from "react-day-picker"
import "react-day-picker/style.css"
import { Popover } from "@base-ui-components/react"
import DatePicker from "../pickers/DatePicker"
import { TournamentCardCallback } from "@/app/(main)/organizators/create/page"
import {useLoadFileMutation} from "@/api/files/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import LocationSelector from "../pickers/LocationPicker/LocationSelector"



export default function TournamentCard({
  tournamentCard,
  isExtended = false,
  isCreate,
  onUpdateCreate = null,
}: {
  tournamentCard?: TournamentCardInterface
  isExtended: boolean
  isCreate: boolean
  onUpdateCreate?: TournamentCardCallback | null
}): JSX.Element {
  return (
    <>
      {!isExtended ? (
        <Link href={`/tournaments/${tournamentCard?.id ?? 0}/${isCreate ? "info/about" : "info/about"}`}>
          <CardContent
            tournamentCard={tournamentCard}
            isExtended={isExtended}
            isCreate={isCreate}
            onUpdateCreate={onUpdateCreate}
          />
        </Link>
      ) : (
        <CardContent
          tournamentCard={tournamentCard}
          isExtended={isExtended}
          isCreate={isCreate}
          onUpdateCreate={onUpdateCreate}
        />
      )}
    </>
  )
}

function CardContent({
  tournamentCard,
  isExtended,
  isCreate,
  onUpdateCreate,
}: {
  tournamentCard?: TournamentCardInterface
  isExtended: boolean
  isCreate: boolean
  onUpdateCreate: TournamentCardCallback | null
}) {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const token = useAppSelector(state => state.auth.token)

  //lazy инициализацию хука))
  const mutationState = isCreate ? useLoadFileMutation() : null;
  const loadFile = mutationState ? mutationState[0] : () => {};
  const { data: loadedFileName, isLoading, isError, isSuccess, error, reset } = mutationState ? mutationState[1] : {};

  const currentLoadingImage = useRef<string>("")
  const [loadedImages, setLoadedImages] = useState<{big: string|null, small: string|null}>({
    big: null,
    small: null,
  })

  useEffect(() => {
    if(isSuccess && !isLoading){
      const newImages = {
        big: currentLoadingImage.current === "big" ? (loadedFileName?.filename ?? null) : loadedImages.big,
        small: currentLoadingImage.current === "small" ? (loadedFileName?.filename ?? null) : loadedImages.small,
      }
      console.log("loadedImages load",  currentLoadingImage.current, loadedFileName?.filename, newImages)
      setLoadedImages(newImages)
      currentLoadingImage.current = ""
      if (onUpdateCreate) {
        onUpdateCreate({
          main_image: newImages.big ?? "",
          tournament_logo: newImages.small ?? "",
        })
      }
    }

  }, [isLoading])

  if (isCreate && !onUpdateCreate) {
    return <>Ошибка!</>
  }

  const handleDivClick = (image_type:string) => {
    if (!fileInputRef.current) return
    if(!currentLoadingImage.current){
      currentLoadingImage.current = image_type
    }
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    reset && reset()
    if (file) {
      if (file.type.startsWith("image/")) {
        loadFile({
          file: file,
          token: token,
        })

        console.log("Выбран файл:", file.name, file)
      }
    }
  }

  useEffect(() => {
    console.log("loadedImages", loadedImages)
  }, [loadedImages]);

  return (
    <>
      <div
        className={clsx(
          "bg-bg-alt border-bg-main flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-500",
          { "hover:border-accent-primary aspect-[8/9] h-[37rem]": !isExtended },
          { "h-[33rem] w-full": isExtended },
        )}
      >
        <div className="relative h-[64%]">
          <img
            className="absolute z-0 h-full w-full object-cover"
            src={FILES_SERVER + (loadedImages.big ?? tournamentCard?.main_image ?? "bigImagePlaceholder.png")}
            loading="lazy"
            alt="Картинка турнира"
          />
          {isCreate && !isLoading && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e)=>handleFileSelect(e)}
                accept="image/*" // Только изображения
                style={{ display: "none" }}
              />
              <div
                onClick={() => handleDivClick("big")}
                className="absolute flex size-full cursor-pointer items-center justify-center bg-transparent opacity-0 transition-all hover:bg-black/50 hover:opacity-100"
              >
                <p className="text-2xl font-bold text-white">Загрузить изображение</p>
              </div>
            </>
          )}
          {isLoading && (
            <div className="absolute z-1 size-full bg-black/50">
              <Loading />
            </div>
          )}
        </div>

        <div className="z-1 flex h-0 w-full items-center pl-5">
          <div className="bg-bg-alt border-border relative mb-6 aspect-square size-20 overflow-hidden rounded-full border">
            <img
              src={FILES_SERVER + (loadedImages.small ?? tournamentCard?.tournament_logo ?? "bigImagePlaceholder.png")}
              loading="lazy"
              className="absolute size-full object-cover"
              alt="лого"
            />
            {isCreate && (
              <div className="absolute flex size-full cursor-pointer items-center justify-center bg-transparent opacity-0 transition-all hover:bg-black/50 hover:opacity-100"
                   onClick={() => handleDivClick("small")}
              >
                <p className="text-2xl font-bold text-white">+</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-text-main flex h-fit w-full flex-col gap-2 px-2 pt-10 pb-5">
          <div className="flex items-center justify-between">
            {!isCreate && (
              <h3 className="overflow-hidden pe-5 text-base font-medium text-ellipsis whitespace-nowrap">
                {tournamentCard?.title ?? "Неизвестный турнир"}
              </h3>
            )}
            {isCreate && (
              <Input
                onChange={(event) => {
                  if (!onUpdateCreate) return
                  onUpdateCreate({ title: event.target.value })
                }}
                className="border-border h-full w-[30rem] rounded-2xl border-[1px] p-2 text-[0.8rem]"
                placeholder={"Название турнира"}
              />
            )}
            <div
              className={clsx(
                "me-5 flex h-7 min-w-fit items-center justify-center rounded-full border",
                { "border-[#ED0F4E] bg-[#ED0F4E]/20 text-[#ED0F4E]": tournamentCard?.tournament_status === "ended" },
                {
                  "border-[#32E875] bg-[#32E875]/20 text-[#32E875]": tournamentCard?.tournament_status === "processing",
                },
                { "border-[#3849FF] bg-[#3849FF]/20 text-[#3849FF]": tournamentCard?.tournament_status === "futured" },
                {
                  "border-[#3849FF] bg-[#3849FF]/20 text-[#3849FF]":
                    tournamentCard?.tournament_status === "registration",
                },
              )}
            >
              <p className="px-5">
                {tournamentCard?.tournament_status === "ended"
                  ? "Завершен"
                  : tournamentCard?.tournament_status === "processing"
                    ? "Проводится"
                    : tournamentCard?.tournament_status === "futured"
                      ? "Запланирован"
                      : tournamentCard?.tournament_status === "registration"
                        ? "Регистрация открыта"
                        : "Неизвестно"}
              </p>
            </div>
          </div>

          <div className="text-text-alt flex items-center gap-2">
            <CiLocationOn className="text-xl" />
            {!isCreate && <p className="text-xs">{tournamentCard?.location ?? "Местоположение неизвестно"}</p>}
            {isCreate && (
              <LocationSelector onPick={onUpdateCreate} />
            )}
          </div>
          <div className="text-text-alt flex items-center gap-2">
            <CiClock2 className="text-xl" />
            {!isCreate && <p className="text-xs">{tournamentCard?.year ?? 2025}</p>}
            {isCreate && (
              <>
                <DatePicker type="range" onPick={(data: DateRange)=>{
                  const startDate = data.from
                  const endDate = data.to
                  const pickedYear = startDate?.getFullYear()

                  const currentSeasonYear = (startDate?.getMonth() ?? 0) > 7  ? (pickedYear??0) + 1 : pickedYear??0

                  onUpdateCreate && onUpdateCreate({
                    start_timestamp: startDate?.getTime(),
                    end_timestamp: endDate?.getTime(),
                    year: currentSeasonYear
                  })
                }}/>
              </>
            )}
          </div>
          <div className="text-text-alt flex items-center gap-2">
            <GoPeople className="text-xl" />
            <p className="text-xs">10 команд</p>
          </div>

          {!isCreate && <p className="text-xs">{tournamentCard?.description ?? "Неисвестный турнир"}</p>}
          {isCreate && (
            <textarea
              onChange={(event) => {
                if (!onUpdateCreate) return
                onUpdateCreate({ description: event.target.value })
              }}
              className="border-border h-20 w-full resize-none rounded-2xl border-[1px] p-2 text-xs"
              placeholder="Описание турнира"
            />
          )}
        </div>
      </div>
    </>
  )
}
