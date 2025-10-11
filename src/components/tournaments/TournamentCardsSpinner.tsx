"use client"
import {useState} from 'react';
import {TournamentCardInterface} from "@/types/TournamentsAPI";
import TournamentCard from './TournamentCard';
import {MdChevronLeft, MdChevronRight} from "react-icons/md";


import {setPage} from '@/redux_stores/Tournaments/TournamentsPageFiltersSlice';
import Loading from "@/app/loading";
import {useTournamentsDispatch, useTournamentsSelector} from "@/components/Redux/tournamentsStoreContext";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import clsx from "clsx";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import Link from "next/link";
import {Right, User} from "@/types/authApi";
import NoTournaments from "@/components/service/NoTournaments";

export default function TournamentCardsSpinner({tournamentsCards, isModerating, rights}: {
    tournamentsCards: TournamentCardInterface[],
    isModerating: boolean,
    rights?: Right[] | null
}) {
    const currentPage = useTournamentsSelector(state => state.tournamentsPageFilters.page)
    const dispatch = useTournamentsDispatch();

    const isOrganizator = ((rights ?? []).filter(r => r.right_flag === "CREATE_TOURNAMENTS").length !== 0) && isModerating;


    const [isAnimating, setIsAnimating] = useState(false);
    const itemsPerPage = 3;
    const totalPages = Math.ceil((tournamentsCards.length + (isOrganizator ? 1 : 0)) / itemsPerPage);
    if (!currentPage) return <Loading/>
    const currentItems = tournamentsCards.slice(
        (currentPage - 1) * itemsPerPage - ((isOrganizator && currentPage !== 1) ? 1 : 0),
        (currentPage) * itemsPerPage - ((isOrganizator) ? 1 : 0)
    )

    const goToPage = async (pageIndex: number) => {
        setIsAnimating(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        dispatch(setPage(pageIndex + 1));
        await new Promise(resolve => setTimeout(resolve, 50));
        setIsAnimating(false);
    };

    if (tournamentsCards.length === 0) {
        return <>
            <div className="h-full">
                <div className="flex h-full items-center justify-center pt-5">
                    <NoTournaments/>
                </div>
            </div>
        </>
    }

    return (
        <div className="relative">
            <div className="flex items-center justify-center pt-5">
                <div className="flex w-[5%] items-center justify-center">
                    <button className="size-10 bg-bg-alt rounded-full border border-border" onClick={
                        async () => {
                            if (currentPage - 1 <= 0) {
                                await goToPage(totalPages - 1)
                            } else {
                                await goToPage(currentPage - 2)
                            }
                        }
                    }>
                        <MdChevronLeft className="size-full text-text-main"/>
                    </button>
                </div>
                <div className={`flex w-[90%] gap-2 justify-center transition-opacity duration-300 ${
                    isAnimating ? 'opacity-0' : 'opacity-100'
                }`}>
                    {(currentPage === 1 && isOrganizator) && (
                        <>
                            <Link
                                className={clsx("flex flex-col  bg-bg-alt  rounded-3xl overflow-hidden transition-all duration-500 border-2 border-bg-main hover:border-accent-primary aspect-[8/9] h-[37rem]",
                                )}
                                href="/organizators/create"
                            >
                                <div className="size-full bg-blue-700"
                                     style={{
                                         WebkitMaskImage: `url('${FILES_SERVER + "add_2_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"}')`,
                                         maskImage: `url('${FILES_SERVER + "add_2_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"}')`,
                                         WebkitMaskSize: `${5}rem ${5}rem`,
                                         maskSize: `${5}rem ${5}rem`,
                                         WebkitMaskRepeat: 'no-repeat', // повторяем только по X
                                         maskRepeat: 'no-repeat',
                                         WebkitMaskPosition: 'center',       // одна строка по центру по Y
                                         maskPosition: 'center',
                                     }}>

                                </div>
                            </Link>
                        </>
                    )}
                    {currentItems.map((tournamentCard) => (
                        <TournamentCard
                            key={tournamentCard.id}
                            tournamentCard={tournamentCard}
                            isExtended={false}
                            isCreate={false}
                            onUpdateCreate={null}
                        />
                    ))}
                </div>
                <div className="flex w-[5%] items-center justify-center">
                    <button className="size-10 bg-bg-alt rounded-full border border-border" onClick={
                        async () => {
                            if (currentPage >= totalPages) {
                                await goToPage(0)
                            } else {
                                await goToPage(currentPage)
                            }
                        }
                    }>
                        <MdChevronRight className="size-full text-text-main"/>
                    </button>
                </div>
            </div>


            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-7">
                    {Array.from({length: totalPages}).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`size-10 rounded-full transition-all bg-bg-alt border ${
                                index === currentPage - 1 ? 'border-accent-primary' : 'border-border'
                            }`}
                        >
                            <p className="font-medium">{index + 1}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}