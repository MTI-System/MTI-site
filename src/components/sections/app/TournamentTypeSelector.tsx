"use client"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { TextDropdown } from "@/components/ui/Dropdown"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setTT } from "@/redux_stores/SearchParamsSlice"
import { useEffect } from "react"

export default function TournamentTypeSelector({ className }: { className?: string }) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const theme = useAppSelector((state) => state.system.theme)
  const isPending = useAppSelector((state) => state.system.isPending)
  const dispatcher = useAppDispatch()
  useEffect(() => {
    console.log("tt", tt)
  }, [tt])
  return (
    <>
      <TextDropdown
        options={availableTournamentTypes.map((tt) => {
          return { displayName: tt.name.toUpperCase(), value: tt.name, active: true }
        })}
        onOptionSelect={(selectedValue) => dispatcher(setTT(selectedValue!!))}
        defaultSelection={
          tt !== null
            ? {
                displayName: tt.toUpperCase(),
                value: tt,
                active: true,
              }
            : {
                displayName: "???",
                value: tt,
                active: false,
              }
        }
        className={className}
        disabled={isPending}
      ></TextDropdown>
    </>
  )
}
