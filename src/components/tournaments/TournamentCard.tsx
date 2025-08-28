import {TournamentCardInterface} from "@/types/TournamentsAPI";
import {CiLocationOn} from "react-icons/ci";
import {CiClock2} from "react-icons/ci";
import {FILES_SERVER} from "@/constants/APIEndpoints";

export default function TournamentCard({tournamentCard}: { tournamentCard: TournamentCardInterface }) {
  return (
    <>
      <div className="flex flex-col w-96 bg-bg-alt h-[30rem] rounded-3xl overflow-hidden transition-all duration-500">
        <img className="flex-1/2 object-cover" src={FILES_SERVER + tournamentCard.mainImage} alt="Картинка турнира"/>
        <div className="pl-5 flex items-center w-full h-0">
          <img src={FILES_SERVER + tournamentCard.tournamentLogo}
               className="border-border border rounded-full size-20 aspect-square mb-6 object-cover" alt="лого"/>
        </div>
        <div className="flex flex-col gap-2 h-fit w-full px-2 pt-10 pb-5 text-text-main">
          <h3 className="font-medium text-base">{tournamentCard.title}</h3>
          <div className="flex text-text-alt items-center">
            <CiLocationOn className="text-xl"/>
            <p className="text-xs">Где?</p>
          </div>
          <div className="flex text-text-alt items-center">
            <CiClock2 className="text-xl"/>
            <p className="text-xs">{tournamentCard.year}</p>
          </div>
          <p className="text-xs">
            {tournamentCard.description}
          </p>
        </div>
      </div>
    </>
  )
}