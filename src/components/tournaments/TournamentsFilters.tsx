"use client"
import ColoredTType from "@/components/ui/ColoredTType";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";

export default function TournamentsFilters() {
  const availableTournamentTypes = useAppSelector(state=>state.searchParams.availableTournamentTypes) ?? []
  const tt = useAppSelector((state) => state.searchParams.tt)
  return (
    <>
      <div className="flex items-center pt-3 w-full h-10">
        <div className="flex gap-5">
          <p className="font-bold text-4xl">
            Турниры
          </p><ColoredTType
              className="font-bold text-4xl"
            ttName={tt?.toString() ?? "1"}
            ttColor={availableTournamentTypes.find((t) => t.id === tt)?.color ?? "#000000"}
          />
        </div>

      </div>
    </>
  )
}