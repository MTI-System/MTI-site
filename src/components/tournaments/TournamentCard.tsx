"use client"
import { TournamentCardInterface } from "@/types/TournamentsAPI"
import { CiLocationOn } from "react-icons/ci"
import { CiClock2 } from "react-icons/ci"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { JSX, useState, useRef, ChangeEvent } from "react"
import clsx from "clsx"
import { GoPeople } from "react-icons/go"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import Loading from "@/app/loading"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/style.css"
import { Popover } from "@base-ui-components/react"

interface TournamentCardCallback {
  (card: Partial<TournamentCardInterface>): void
}

export default function TournamentCard({
  tournamentCard,
  isExtended = false,
  isCreate,
  onUpdateCreate = null,
}: {
  tournamentCard: TournamentCardInterface
  isExtended: boolean
  isCreate: boolean
  onUpdateCreate?: TournamentCardCallback | null
}): JSX.Element {
  return (
    <>
      {!isExtended ? (
        <Link href={`/tournaments/${tournamentCard.id}/${isCreate ? "info/about" : "info/about"}`}>
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
  tournamentCard: TournamentCardInterface
  isExtended: boolean
  isCreate: boolean
  onUpdateCreate: TournamentCardCallback | null
}) {
  const [isBigImageLoading, setIsBigImageLoading] = useState<boolean>(false)
  const [isSmallImageLoading, setIsSmallImageLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<DateRange>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  if (isCreate && !onUpdateCreate) {
    return <>Ошибка!</>
  }

  const handleDivClick = () => {
    if (!fileInputRef.current) return
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      if (file.type.startsWith("image/")) {
        console.log("Выбран файл:", file.name)
        const imageUrl = URL.createObjectURL(file)
        setIsBigImageLoading(true)
      }
    }
  }

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
            src={FILES_SERVER + tournamentCard.main_image}
            loading="lazy"
            alt="Картинка турнира"
          />
          {isCreate && !isBigImageLoading && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*" // Только изображения
                style={{ display: "none" }}
              />
              <div
                onClick={() => handleDivClick()}
                className="absolute flex size-full cursor-pointer items-center justify-center bg-transparent opacity-0 transition-all hover:bg-black/50 hover:opacity-100"
              >
                <p className="text-2xl font-bold text-white">Загрузить изображение</p>
              </div>
            </>
          )}
          {isBigImageLoading && (
            <div className="absolute z-1 size-full bg-black/50">
              <Loading />
            </div>
          )}
        </div>

        <div className="z-1 flex h-0 w-full items-center pl-5">
          <div className="bg-bg-alt border-border relative mb-6 aspect-square size-20 overflow-hidden rounded-full border">
            <img
              src={FILES_SERVER + tournamentCard.tournament_logo}
              loading="lazy"
              className="absolute size-full object-cover"
              alt="лого"
            />
            {isCreate && (
              <div className="absolute flex size-full cursor-pointer items-center justify-center bg-transparent opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
                <p className="text-2xl font-bold text-white">+</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-text-main flex h-fit w-full flex-col gap-2 px-2 pt-10 pb-5">
          <div className="flex items-center justify-between">
            {!isCreate && (
              <h3 className="overflow-hidden pe-5 text-base font-medium text-ellipsis whitespace-nowrap">
                {tournamentCard.title}
              </h3>
            )}
            {isCreate && (
              <Input
                onChange={(event) => {
                  if (!onUpdateCreate) return
                  onUpdateCreate({ title: event.target.value })
                }}
                className="border-border h-full w-[30rem] rounded-2xl border-[1px] p-2 text-[0.8rem]"
                defaultValue="Название турнира"
              />
            )}
            <div
              className={clsx(
                "me-5 flex h-7 min-w-fit items-center justify-center rounded-full border",
                { "border-[#ED0F4E] bg-[#ED0F4E]/20 text-[#ED0F4E]": tournamentCard.tournament_status === "ended" },
                {
                  "border-[#32E875] bg-[#32E875]/20 text-[#32E875]": tournamentCard.tournament_status === "processing",
                },
                { "border-[#3849FF] bg-[#3849FF]/20 text-[#3849FF]": tournamentCard.tournament_status === "futured" },
                {
                  "border-[#3849FF] bg-[#3849FF]/20 text-[#3849FF]":
                    tournamentCard.tournament_status === "registration",
                },
              )}
            >
              <p className="px-5">
                {tournamentCard.tournament_status === "ended"
                  ? "Завершен"
                  : tournamentCard.tournament_status === "processing"
                    ? "Проводится"
                    : tournamentCard.tournament_status === "futured"
                      ? "Запланирован"
                      : tournamentCard.tournament_status === "registration"
                        ? "Регистрация открыта"
                        : "Неизвестно"}
              </p>
            </div>
          </div>

          <div className="text-text-alt flex items-center gap-2">
            <CiLocationOn className="text-xl" />
            {!isCreate && <p className="text-xs">Где?</p>}
            {isCreate && (
              <Input
                className="border-border h-[1.5rem] w-[7rem] rounded-2xl border-[1px] p-2 text-[0.8rem]"
                defaultValue="Место проведения (потом)"
              />
            )}
          </div>
          <div className="text-text-alt flex items-center gap-2">
            <CiClock2 className="text-xl" />
            {!isCreate && <p className="text-xs">{tournamentCard.year}</p>}
            {isCreate && (
              <>
                <Popover.Root>
                  <Popover.Trigger className="border-border h-[1.5rem] w-[7rem] rounded-2xl border-[1px] text-[0.8rem]">
                    Выбрать даты
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner className="relative z-2" sideOffset={8} align={"end"}>
                      <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                        <DayPicker
                          mode="range"
                          onSelect={setSelected}
                          selected={selected}
                          classNames={{
                            month_grid: "border-separate border-spacing-0",
                            today: `border-border border rounded-full`, // Add a border to today's date
                            range_middle: "bg-accent-primary/50",
                            selected: `bg-accent-primary text-text-on-accent rounded-none! border-none!`, // Highlight the selected day
                            range_start: "rounded-l-full shadow-[2px_0_4px_rgba(from_var(--color-accent-primary)_r_g_b/0.3)]",
                            range_end: "rounded-r-full shadow-[-2px_0_4px_rgba(from_var(--color-accent-primary)_r_g_b/0.3)]",
                          }}
                        />
                        <button className="bg-accent-primary/25 hover:bg-accent-primary/50 p-2 border-3 text-accent-primary border-accent-primary rounded-2xl w-full mt-[1rem]">Применить</button>
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </>
            )}
          </div>
          <div className="text-text-alt flex items-center gap-2">
            <GoPeople className="text-xl" />
            <p className="text-xs">10 команд</p>
          </div>

          {!isCreate && <p className="text-xs">{tournamentCard.description}</p>}
          {isCreate && (
            <textarea
              onChange={(event) => {
                if (!onUpdateCreate) return
                onUpdateCreate({ description: event.target.value })
              }}
              className="border-border h-20 w-full resize-none rounded-2xl border-[1px] p-2 text-xs"
              defaultValue="Описание турнира"
            />
          )}
        </div>
      </div>
    </>
  )
}
