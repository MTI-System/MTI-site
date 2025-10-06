"use client"
import ColoredTType from "@/components/ui/ColoredTType";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";

export default function TournamentsFilters() {
  const availableTournamentTypes = useAppSelector(state=>state.searchParams.availableTournamentTypes) ?? []
  const tt = useAppSelector((state) => state.searchParams.tt)
  return (
    <>
      <div className="flex items-center pt-3 w-full h-10">
        <div className="flex h-fit pt-2 w-full content-center items-center gap-5">
          <p className="font-bold text-4xl text-text-main">
            Турниры
          </p>
          <ColoredTType
              ttName={availableTournamentTypes.find((t) => t.id === tt)?.name ?? "ТЮФ"}
              ttColor={availableTournamentTypes.find((t) => t.id === tt)?.color ?? "#000000"}
              className="font-bold text-4xl text-text-main"
          />
        </div>

      </div>
    </>
  )
}