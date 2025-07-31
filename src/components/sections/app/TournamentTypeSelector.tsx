"use client"
import {availableTournamentTypes} from "@/constants/AvailableTournaments"
import {TextDropdown} from "@/components/ui/Dropdown"
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore"
import {setTT} from "@/redux_stores/SearchParamsSlice"
import {useEffect} from "react"
import cookies from "js-cookie";
import {TOURNAMENT_TYPE_KEY_NAME} from "@/constants/CookieKeys";
import headerStyle from "@/styles/components/sections/app/header.module.css"

export default function TournamentTypeSelector({className}: { className?: string }) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const theme = useAppSelector((state) => state.system.theme)
  const isPending = useAppSelector((state) => state.system.isPending)
  const dispatcher = useAppDispatch()
  const isTTLocked = useAppSelector((state) => state.searchParams.isTTLocked)
  useEffect(() => {
    console.log("tt", tt)
  }, [tt])
  return (
    <>
      <div className={headerStyle.hoverTextContainer}>
        <TextDropdown
          options={availableTournamentTypes.map((tt) => {
            return {displayName: tt.name.toUpperCase(), value: tt.name, active: true}
          })}
          onOptionSelect={(selectedValue) => {
            cookies.set(TOURNAMENT_TYPE_KEY_NAME, selectedValue ?? "ТЮФ")
            dispatcher(setTT(selectedValue!!))
          }}
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
          disabled={isPending || isTTLocked}
        ></TextDropdown>
          {isTTLocked && <p className={headerStyle.hoverText}>На этой странице нельзя изменить тип турнира</p>}

      </div>
    </>
  )
}
