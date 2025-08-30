"use client"
import ColoredTType from "@/components/ui/ColoredTType";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";

export default function TournamentsFilters() {
  const tt = useAppSelector((state) => state.searchParams.tt)
  return (
    <>
      <div className="flex items-center pt-3 w-full h-10">
        <div className="flex gap-5">
          <p className="font-bold text-4xl">
            Турниры
          </p>
          <p className="font-bold text-4xl"><ColoredTType
            ttName={tt ?? "ТЮФ"}
            ttColor={availableTournamentTypes.find((t) => t.name === tt)?.color ?? "#000000"}
          /></p>
        </div>

      </div>
    </>
  )
}