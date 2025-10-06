"use client"
import TournamentCard from "@/components/tournaments/TournamentCard";
import {useCallback, useEffect, useState} from "react";
import {FightContainerCard, TournamentCardInterface} from "@/types/TournamentsAPI";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import {debounce} from "next/dist/server/utils";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {useRouter} from "next/navigation";
import TournamentInformationConstructor from "@/components/organizator/TournamentInformationConstructor";
import Loading from "@/app/loading";
import FightsInformations from "@/components/organizator/FightsInformations";
import Link from "next/link";


export default function CreateTournamentPage(){
    const rights = useAppSelector(state => state.auth.authInfo?.rights)
    const isOrganizator = ((rights ?? []).filter(r => r.right_flag === "CREATE_TOURNAMENTS").length !== 0);
    const router = useRouter();
    const [newTournamentCard, setNewTournamentCard] = useState<TournamentCardInterface>({
        id: -1,
        title: "Новый турнир",
        description: "Описание",
        main_image: "bigImagePlaceholder.png",
        tournament_logo: "bigImagePlaceholder.png",
        year: 2026,
        tournament_status: "futured",
        fight_containers_cards: [],
        materials: [],
    });
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true)
    }, []);

    const updateTournamentHandler = useCallback(
        debounce((updates: Partial<TournamentCardInterface>) => {
            console.log("Updates", updates);
            setNewTournamentCard(prev => ({
                ...prev,
                ...updates
            }));
        }, 500),
        []
    );

    if (!rights || !isMounted){
        return <Loading/>
    }

    if (!isOrganizator){
        router.push("/login");
    }





    return (
        <div className="flex flex-col gap-2 py-2 text-text-main">
            <TournamentCard tournamentCard={newTournamentCard} isExtended={true} isCreate={true} onUpdateCreate={updateTournamentHandler}/>
            <div className="bg-bg-alt min-h-30 w-full rounded-3xl px-5 py-2">
                <TournamentInformationConstructor/>
            </div>
            <div className="bg-bg-alt min-h-30 w-full rounded-3xl px-5 py-2">
                <FightsInformations/>
            </div>
            <div className="flex justify-between items-center bg-bg-alt h-fit w-full rounded-3xl px-5 py-3">
                <Link
                    href="/organizators"
                    className="bg-[#ED0F4E]/20 border hover:bg-[#ED0F4E]/50 border-[#ED0F4E] text-[#ED0F4E] h-[2.5rem] rounded-2xl w-50 text-center flex items-center justify-center"
                >Отмена</Link>
                <button
                    className="bg-accent-primary/20 border hover:bg-accent-primary/50 border-accent-primary text-accent-primary h-[2.5rem] rounded-2xl w-50 cursor-pointer"
                >Создать</button>
            </div>
        </div>
    )
}