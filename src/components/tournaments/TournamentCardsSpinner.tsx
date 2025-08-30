"use client"
import {useState} from 'react';
import {TournamentCardInterface} from "@/types/TournamentsAPI";
import TournamentCard from './TournamentCard';
import {MdChevronLeft, MdChevronRight} from "react-icons/md";


import { setPage } from '@/redux_stores/Tournaments/TournamentsPageFiltersSlice';
import Loading from "@/app/loading";
import {useTournamentsDispatch, useTournamentsSelector} from "@/components/Redux/tournamentsStoreContext";

export default function TournamentCardsSpinner({tournamentsCards}: { tournamentsCards: TournamentCardInterface[] }) {
  const currentPage = useTournamentsSelector(state=>state.tournamentsPageFilters.page)


  const dispatch = useTournamentsDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(tournamentsCards.length / itemsPerPage);
  console.log("CURRENT PAGE IN SPINNER", currentPage)
  if (!currentPage) return <Loading />
  const currentItems = tournamentsCards.slice(
    (currentPage - 1) * itemsPerPage ,
    (currentPage) * itemsPerPage
  )


  const goToPage = async (pageIndex: number) => {
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    dispatch(setPage(pageIndex + 1));
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsAnimating(false);
  };



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
          {currentItems.map((tournamentCard) => (
            <TournamentCard
              key={tournamentCard.id}
              tournamentCard={tournamentCard}
              isExtended={false}
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