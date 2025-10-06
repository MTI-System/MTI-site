"use client"
import {TournamentCardInterface} from "@/types/TournamentsAPI";
import {CiLocationOn} from "react-icons/ci";
import {CiClock2} from "react-icons/ci";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import {redirect} from 'next/navigation'
import {JSX, useState, useRef, ChangeEvent} from "react";
import clsx from "clsx";
import {GoPeople} from "react-icons/go";
import Link from "next/link";
import {Input} from "@/components/ui/Input";
import Loading from "@/app/loading";


interface TournamentCardCallback {
    (card: Partial<TournamentCardInterface>): void;
}

export default function TournamentCard({tournamentCard, isExtended = false, isCreate, onUpdateCreate = null}: {
    tournamentCard: TournamentCardInterface,
    isExtended: boolean,
    isCreate: boolean,
    onUpdateCreate?: TournamentCardCallback | null,
}): JSX.Element {
    return (
        <>
            {!isExtended ? (
                <Link href={`/tournaments/${tournamentCard.id}/${isCreate ? "info/about" : "info/about"}`}>
                    <CardContent tournamentCard={tournamentCard} isExtended={isExtended} isCreate={isCreate}
                                 onUpdateCreate={onUpdateCreate}/>
                </Link>
            ) : (
                <CardContent tournamentCard={tournamentCard} isExtended={isExtended} isCreate={isCreate}
                             onUpdateCreate={onUpdateCreate}/>
            )}
        </>
    )
}

function CardContent({tournamentCard, isExtended, isCreate, onUpdateCreate}: {
    tournamentCard: TournamentCardInterface,
    isExtended: boolean,
    isCreate: boolean,
    onUpdateCreate: TournamentCardCallback | null,
}) {
    const [isBigImageLoading, setIsBigImageLoading] = useState<boolean>(false);
    const [isSmallImageLoading, setIsSmallImageLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    if (isCreate && !onUpdateCreate) {
        return <>Ошибка!</>
    }


    const handleDivClick = () => {
        if (!fileInputRef.current) return
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            if (file.type.startsWith('image/')) {

                console.log('Выбран файл:', file.name);
                const imageUrl = URL.createObjectURL(file);
                setIsBigImageLoading(true);
            }
        }
    };

    return (
        <>
            <div
                className={clsx("flex  flex-col  bg-bg-alt  rounded-3xl overflow-hidden transition-all duration-500 border-2 border-bg-main",
                    {"hover:border-accent-primary aspect-[8/9] h-[37rem]": !isExtended},
                    {"w-full h-[33rem]": isExtended},
                )}>
                <div className="relative  h-[64%]">
                    <img className="absolute object-cover h-full w-full z-0"
                         src={FILES_SERVER + tournamentCard.main_image}
                         loading="lazy"
                         alt="Картинка турнира"/>
                    {isCreate && !isBigImageLoading && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*" // Только изображения
                                style={{display: 'none'}}
                            />
                            <div
                                onClick={() => handleDivClick()}
                                className="absolute justify-center items-center flex size-full bg-transparent hover:bg-black/50 opacity-0 hover:opacity-100 transition-all cursor-pointer">
                                <p className="text-white font-bold text-2xl">Загрузить изображение</p>
                            </div>
                        </>
                    )
                    }
                    {isBigImageLoading && (
                        <div className="absolute size-full bg-black/50 z-1">
                            <Loading/>
                        </div>
                    )}
                </div>


                <div className=" pl-5 flex items-center w-full h-0 z-1">
                    <div
                        className="relative bg-bg-alt border-border border rounded-full size-20 aspect-square mb-6 overflow-hidden">
                        <img src={FILES_SERVER + tournamentCard.tournament_logo}
                             loading="lazy"
                             className="absolute size-full object-cover"
                             alt="лого"/>
                        {isCreate && <div
                            className="absolute justify-center items-center flex size-full bg-transparent hover:bg-black/50 opacity-0 hover:opacity-100 transition-all cursor-pointer">
                            <p className="text-white font-bold text-2xl">+</p>
                        </div>}
                    </div>

                </div>
                <div className="flex flex-col gap-2 h-fit w-full px-2 pt-10 pb-5 text-text-main">
                    <div className="flex justify-between items-center">
                        {!isCreate && <h3 className="font-medium text-base whitespace-nowrap overflow-hidden text-ellipsis pe-5">{tournamentCard.title}</h3>}
                        {isCreate && <Input onChange={(event) => {
                            if (!onUpdateCreate) return;
                            onUpdateCreate({title: event.target.value});
                        }}
                                            className="border-border w-[30rem] h-full rounded-2xl border-[1px] p-2 text-[0.8rem] "
                                            defaultValue="Название турнира"/>}
                        <div className={clsx("min-w-fit h-7 me-5 rounded-full flex justify-center items-center border",
                            {"bg-[#ED0F4E]/20 border-[#ED0F4E] text-[#ED0F4E]": tournamentCard.tournament_status === "ended"},
                            {"bg-[#32E875]/20 border-[#32E875] text-[#32E875]": tournamentCard.tournament_status === "processing"},
                            {"bg-[#3849FF]/20 border-[#3849FF] text-[#3849FF]": tournamentCard.tournament_status === "futured"},
                            {"bg-[#3849FF]/20 border-[#3849FF] text-[#3849FF]": tournamentCard.tournament_status === "registration"},
                        )}>
                            <p className="px-5">{tournamentCard.tournament_status === "ended"
                                ? "Завершен" : tournamentCard.tournament_status === "processing"
                                    ? "Проводится" : tournamentCard.tournament_status === "futured"
                                        ? "Запланирован": tournamentCard.tournament_status === "registration"
                                            ? "Регистрация открыта" : "Неизвестно"
                            }</p>
                        </div>
                    </div>

                    <div className="flex text-text-alt items-center gap-2">
                        <CiLocationOn className="text-xl"/>
                        {!isCreate && <p className="text-xs">Где?</p>}
                        {isCreate && <Input
                            className="border-border w-[7rem] h-[1.5rem] rounded-2xl border-[1px] p-2 text-[0.8rem]"
                            defaultValue="Место проведения (потом)"/>}
                    </div>
                    <div className="flex text-text-alt items-center gap-2">
                        <CiClock2 className="text-xl"/>
                        {!isCreate && <p className="text-xs">{tournamentCard.year}</p>}
                        {isCreate && <Input
                            className="border-border w-[7rem] h-[1.5rem] rounded-2xl border-[1px] p-2 text-[0.8rem]"
                            defaultValue="Даты (потом)"/>}
                    </div>
                    <div className="flex text-text-alt items-center gap-2">
                        <GoPeople className="text-xl"/>
                        <p className="text-xs">10 команд</p>
                    </div>

                    {!isCreate && <p className="text-xs">
                        {tournamentCard.description}
                    </p>}
                    {isCreate && <textarea onChange={(event) => {
                        if (!onUpdateCreate) return;
                        onUpdateCreate({description: event.target.value});
                    }}
                                           className="border-border text-xs h-20 w-full resize-none rounded-2xl border-[1px] p-2"
                                           defaultValue="Описание турнира"/>}
                </div>


            </div>

        </>
    )
}