"use client"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { StaticDropdown } from "@/components/ui/Dropdown"
import { useContext } from "react"
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {setTT} from "@/redux_stores/TournamentTypeSlice";

export default function TournamentTypeSelector({ className }: { className?: string }) {
  const tt = useAppSelector(state => state.tt.tt)
  const  dispatcher = useAppDispatch()
  return (
    <StaticDropdown
      options={availableTournamentTypes.map((tt) => {
        return { displayName: tt.name.toUpperCase(), value: tt.name, active: true }
      })}
      onOptionSelect={(selectedValue) => (dispatcher(setTT(selectedValue)))}
      defaultSelection={
        tt !== null
          ? {
              displayName: tt.toUpperCase(),
              value: tt,
              active: true,
            }
          : 0
      }
      className={className}
      disabled={false}
    ></StaticDropdown>
  )
}
