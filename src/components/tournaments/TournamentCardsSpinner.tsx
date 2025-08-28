"use client"
import {useState} from 'react';
import {TournamentCardInterface} from "@/types/TournamentsAPI";
import TournamentCard from './TournamentCard';
import {MdChevronLeft, MdChevronRight} from "react-icons/md";

export default function TournamentCardsSpinner({tournamentsCards}: { tournamentsCards: TournamentCardInterface[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(tournamentsCards.length / itemsPerPage);


  const currentItems = tournamentsCards.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )


  const goToPage = async (pageIndex: number) => {
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentPage(pageIndex);
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsAnimating(false);
  };


  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <div className="flex flex-1/6 items-center justify-center">
          <button className="size-10 bg-bg-alt rounded-full border border-border" onClick={
            async () => {
              if (currentPage <= 0) {
                await goToPage(totalPages - 1)
              } else {
                await goToPage(currentPage - 1)
              }
            }
          }>
            <MdChevronLeft className="size-full text-text-main"/>
          </button>
        </div>
        <div className={`flex  flex-4/6 gap-2 justify-start transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}>
          {currentItems.map((tournamentCard) => (
            <TournamentCard
              key={tournamentCard.id}
              tournamentCard={tournamentCard}
            />
          ))}
        </div>
        <div className="flex flex-1/6 items-center justify-center">
          <button className="size-10 bg-bg-alt rounded-full border border-border" onClick={
            async () => {
              if (currentPage >= totalPages - 1) {
                await goToPage(0)
              } else {
                await goToPage(currentPage + 1)
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
                index === currentPage ? 'border-accent-primary' : 'border-border'
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