"use client"

import { FILES_SERVER } from "@/constants/APIEndpoints";
import twclsx from "@/utils/twClassMerge";
import { ReactNode, useRef, useState } from "react";

export default function CardContent<T>(
    {   
        card,
        isExtended = false,
        onUpdateCreate = null,
        errors = [],
        children,
        isAdmin = false,
        isCreate
    }:{
        children: ReactNode,
        isCreate: boolean
        onUpdateCreate?: T | null
        errors?: { key: string; message: string }[]
        isAdmin?: boolean,
        isExtended: boolean,
        card: CardInterface
    }
) {
    const [loadedImages, setLoadedImages] = useState<{ big: string | null; small: string | null }>({
        big: null,
        small: null,
    })
    const currentLoadingImage = useRef<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isLoading = false
    return (
        <>
                {/* <div
                    className={twclsx(
                    "bg-bg-alt border-bg-main flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-500",
                    { "hover:border-accent-primary aspect-[8/9] h-[37rem]": !isExtended },
                    { "h-[33rem] w-full": isExtended },
                    )}
                >
                    <div className="relative h-[64%]">
                    <img
                        className="absolute z-0 h-full w-full object-cover"
                        src={FILES_SERVER + (loadedImages.big ?? card?.main_image ?? "bigImagePlaceholder.png")}
                        loading="lazy"
                        alt="Картинка турнира"
                    />
                    {isCreate && !isLoading && (
                        <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileSelect(e)}
                            accept="image/*" 
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
                    
                    {isAdmin && (
                        <Link href={`/tournaments/${tournamentCard?.id ?? 0}/settings`}>
                        <IoMdSettings className="absolute z-1 bg-white size-10 right-0 m-2 rounded-xl p-1 hover:opacity-75 cursor-pointer"/>
                        </Link>
                    )}
                    </div>

                    <div className="z-1 flex h-0 w-full items-center pl-5">
                    <div className="relative bg-bg-alt border-border relative mb-6 aspect-square size-20 overflow-hidden rounded-full border">
                        <img
                        src={FILES_SERVER + (loadedImages.small ?? tournamentCard?.tournament_logo ?? "bigImagePlaceholder.png")}
                        loading="lazy"
                        className="absolute size-full object-cover"
                        alt="лого"
                        />
                        {isCreate && (
                        <div
                            className="absolute flex size-full cursor-pointer items-center justify-center bg-transparent opacity-0 transition-all hover:bg-black/50 hover:opacity-100"
                            onClick={() => handleDivClick("small")}
                        >
                            <p className="text-2xl font-bold text-white">+</p>
                        </div>
                        )}

                    </div>
                    </div>
                    <div className="text-text-main flex h-fit w-full flex-col gap-2 px-2 pt-10 pb-5">
                    <Tooltip.Provider delay={150}>
                        <div className="flex items-center justify-between">
                        {!isCreate && (
                            <h3 className="overflow-hidden pe-5 text-base font-medium text-ellipsis whitespace-nowrap">
                            {tournamentCard?.title ?? "Неизвестный турнир"}
                            </h3>
                        )}
                        {isCreate && (
                            <Tooltip.Root disabled={errorsInternal.length === 0 || !errorsInternal.some((error) => error.key === "title")}>
                            <Tooltip.Trigger>
                                <Input
                                onChange={(event) => {
                                    setErrorsInternal(errorsInternal.filter((error) => error.key !== "title"))
                                    if (!onUpdateCreate) return
                                    onUpdateCreate({ title: event.target.value })
                                }}
                                className={twclsx(
                                    "border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border transition-colors",
                                    errorsInternal.some((error) => error.key === "title") && "border-red-500",
                                )}
                                placeholder={"Название турнира"}
                                />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Positioner sideOffset={10} className="z-10">
                                <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                                    <p className="text-red-500">{errorsInternal.find((error) => error.key === "title")?.message ?? ""}</p>
                                </Tooltip.Popup>
                                </Tooltip.Positioner>
                            </Tooltip.Portal>
                            </Tooltip.Root>
                        )}
                        <div
                            className={twclsx(
                            "me-5 flex h-7 min-w-fit items-center justify-center rounded-full border transition-colors",
                            { "border-[#ED0F4E] bg-[#ED0F4E]/20 text-[#ED0F4E]": tournamentCard?.tournament_status === "ended" },
                            {
                                "border-[#32E875] bg-[#32E875]/20 text-[#32E875]":
                                tournamentCard?.tournament_status === "processing",
                            },
                            {
                                "border-[#3849FF] bg-[#3849FF]/20 text-[#3849FF]": tournamentCard?.tournament_status === "futured",
                            },
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
                            <Tooltip.Root disabled={errorsInternal.length === 0 || !errorsInternal.some((error) => error.key === "location")}>
                            <Tooltip.Trigger
                                render={
                                <div className={twclsx(errorsInternal.some((error) => error.key === "location") && "text-red-500")}></div>
                                }
                            >
                                <LocationSelector onPick={(data) => {
                                setErrorsInternal(errorsInternal.filter((error) => error.key !== "location"))
                                if (!onUpdateCreate) return
                                onUpdateCreate(data)
                                }} />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Positioner sideOffset={10} className="z-10">
                                <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                                    <p className="text-red-500">
                                    {errorsInternal.find((error) => error.key === "location")?.message ?? ""}
                                    </p>
                                </Tooltip.Popup>
                                </Tooltip.Positioner>
                            </Tooltip.Portal>
                            </Tooltip.Root>
                        )}
                        </div>
                        <div className="text-text-alt flex items-center gap-2">
                        <CiClock2 className="text-xl" />
                        {!isCreate && (
                            <p className="text-xs">
                            {formatDate(new Date(tournamentCard?.start_date_timestamp ?? 0))} -{" "}
                            {formatDate(new Date(tournamentCard?.end_date_timestamp ?? 0))}
                            </p>
                        )}
                        {isCreate && (
                            <Tooltip.Root disabled={errorsInternal.length === 0 || !errorsInternal.some((error) => error.key === "start_timestamp")}>
                            <Tooltip.Trigger
                                render={
                                <div
                                    className={twclsx(errorsInternal.some((error) => error.key === "start_timestamp") && "text-red-500")}
                                ></div>
                                }
                            >
                                <DatePicker
                                type="range"
                                onPick={(data: DateRange) => {
                                    setErrorsInternal(errorsInternal.filter((error) => error.key !== "start_timestamp"))
                                    const startDate = data.from
                                    const endDate = data.to
                                    const pickedYear = startDate?.getFullYear()

                                    const currentSeasonYear =
                                    (startDate?.getMonth() ?? 0) > 7 ? (pickedYear ?? 0) + 1 : (pickedYear ?? 0)

                                    onUpdateCreate &&
                                    onUpdateCreate({
                                        start_timestamp: startDate?.getTime(),
                                        end_timestamp: endDate?.getTime(),
                                        year: currentSeasonYear,
                                    })
                                }}
                                />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Positioner sideOffset={10} className="z-10">
                                <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                                    <p className="text-red-500">
                                    {errorsInternal.find((error) => error.key === "start_timestamp")?.message ?? ""}
                                    </p>
                                </Tooltip.Popup>
                                </Tooltip.Positioner>
                            </Tooltip.Portal>
                            </Tooltip.Root>
                        )}
                        </div>
                        <div className="text-text-alt flex items-center gap-2">
                        <GoPeople className="text-xl" />
                        <p className="text-xs">10 команд</p>
                        </div>

                        {!isCreate && <p className="text-xs">{tournamentCard?.description ?? "Неисвестный турнир"}</p>}
                        {isCreate && (
                        <Tooltip.Root disabled={errorsInternal.length === 0 || !errorsInternal.some((error) => error.key === "description")}>
                            <Tooltip.Trigger
                            render={
                                <div
                                ></div>
                            }
                            >
                            <textarea
                                onChange={(event) => {
                                setErrorsInternal(errorsInternal.filter((error) => error.key !== "description"))
                                if (!onUpdateCreate) return
                                onUpdateCreate({ description: event.target.value })
                                }}
                                className={twclsx(
                                "border-border border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-20 w-full resize-none rounded-2xl border-[1px] p-2 text-xs transition-colors",
                                errorsInternal.some((error) => error.key === "description") && "border-red-500",
                                )}
                                placeholder="Описание турнира"
                            />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                            <Tooltip.Positioner sideOffset={10} className="z-10">
                                <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                                <p className="text-red-500">
                                    {errorsInternal.find((error) => error.key === "description")?.message ?? ""}
                                </p>
                                </Tooltip.Popup>
                            </Tooltip.Positioner>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                        )}
                    </Tooltip.Provider>
                    </div>
                </div> */}
        </>
    )
}