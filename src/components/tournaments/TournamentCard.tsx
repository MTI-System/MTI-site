"use client"
import {TournamentCardInterface} from "@/types/TournamentsAPI";
import {CiLocationOn} from "react-icons/ci";
import {CiClock2} from "react-icons/ci";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import {redirect} from 'next/navigation'
import {JSX} from "react";
import clsx from "clsx";
import {GoPeople} from "react-icons/go";
import Link from "next/link";

export default function TournamentCard({tournamentCard, isExtended = false, isModerator}: {
    tournamentCard: TournamentCardInterface,
    isExtended: boolean,
    isModerator: boolean,
}): JSX.Element {
    return (
        <>
            {!isExtended ? (
                <Link href={`/tournaments/${tournamentCard.id}/${isModerator ? "info/about" : "info/about"}`}>
                    <CardContent tournamentCard={tournamentCard} isExtended={isExtended} isModerator={isModerator}/>
                </Link>
            ) : (
                <CardContent tournamentCard={tournamentCard} isExtended={isExtended} isModerator={isModerator}/>
            )}
        </>
    )
}

function CardContent({tournamentCard, isExtended, isModerator}: {
    tournamentCard: TournamentCardInterface,
    isExtended: boolean,
    isModerator: boolean,
}) {
    return (
        <>
            <div
                className={clsx("flex flex-col  bg-bg-alt  rounded-3xl overflow-hidden transition-all duration-500 border-2 border-bg-main",
                    {"hover:border-accent-primary aspect-[8/9] h-[37rem]": !isExtended},
                    {"w-full h-[33rem]": isExtended},
                )}>
                <img className="object-cover h-[64%]" src={FILES_SERVER + tournamentCard.main_image}
                     alt="Картинка турнира"/>
                <div className="pl-5 flex items-center w-full h-0">
                    <img src={FILES_SERVER + tournamentCard.tournament_logo}
                         className="border-border border rounded-full size-20 aspect-square mb-6 object-cover"
                         alt="лого"/>
                </div>
                <div className="flex">
                    <div className="flex flex-col gap-2 h-fit w-full px-2 pt-10 pb-5 text-text-main">
                        <h3 className="font-medium text-base">{tournamentCard.title}</h3>
                        <div className="flex text-text-alt items-center gap-2">
                            <CiLocationOn className="text-xl"/>
                            <p className="text-xs">Где?</p>
                        </div>
                        <div className="flex text-text-alt items-center gap-2">
                            <CiClock2 className="text-xl"/>
                            <p className="text-xs">{tournamentCard.year}</p>
                        </div>
                        <div className="flex text-text-alt items-center gap-2">
                            <GoPeople className="text-xl"/>
                            <p className="text-xs">10 команд</p>
                        </div>
                        <p className="text-xs">
                            {tournamentCard.description}
                        </p>
                    </div>
                    {isExtended &&
                        <div className={clsx("w-30 h-7 m-10 rounded-full flex justify-center items-center border",
                            {"bg-[#ED0F4E]/20 border-[#ED0F4E] text-[#ED0F4E]": tournamentCard.tournament_status === "ended"},
                            {"bg-[#32E875]/20 border-[#32E875] text-[#32E875]": tournamentCard.tournament_status === "processing"},
                            {"bg-[#3849FF]/20 border-[#3849FF] text-[#3849FF]": tournamentCard.tournament_status === "futured"},
                        )}>
                            <p className="px-5">{tournamentCard.tournament_status === "ended" ? "Завершен" : tournamentCard.tournament_status === "processing" ? "Проводится" : tournamentCard.tournament_status === "futured" ? "Запланирован" : "Неизвестно"}</p>
                        </div>}
                </div>

            </div>

        </>
    )
}