"use client"
import {availableTournamentTypes} from "@/constants/AvailableTournaments"
import {TextDropdown} from "@/components/ui/Dropdown"
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore"
import {setTT, setYear} from "@/redux_stores/SearchParamsSlice"
import {useEffect, useState} from "react"
import cookies from "js-cookie"
import {TOURNAMENT_TYPE_KEY_NAME} from "@/constants/CookieKeys"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/Tooltip"
import {usePathname, useRouter} from "next/navigation";
import ColoredTType from "@/components/ui/ColoredTType";

export default function TournamentTypeSelector({className}: { className?: string }) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const isPending = useAppSelector((state) => state.system.isPending)
  const dispatcher = useAppDispatch()
  const [isTTLocked, setIsTTLocked] = useState(false)
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  const lockedPages = ["/problems/"]

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) {
      return
    }
    lockedPages.forEach(page => {
        setIsTTLocked(lockedPages.some((path) => pathname.startsWith(path)))
      }
    )

  }, [pathname, hasMounted]);

  useEffect(() => {
  }, [isTTLocked]);

  return (
    <>
      <div className="">
        <Tooltip disabled={!isTTLocked}>
          <TooltipTrigger>
            <TextDropdown
              options={availableTournamentTypes.map((tt) => {
                return {displayName: <ColoredTType ttColor={tt.color} ttName={tt.name}/>, value: tt.name, active: true}
              })}
              onOptionSelect={(event) => {
                const selectedValue = event.selection
                cookies.set(TOURNAMENT_TYPE_KEY_NAME, selectedValue ?? "ТЮФ")
                dispatcher(setYear(null))
                dispatcher(setTT(selectedValue!!))
              }}
              defaultSelection={
                tt !== null
                  ? {
                    displayName: <ColoredTType ttColor={availableTournamentTypes.find(t=>t.name===tt)?.color??""} ttName={tt}/>,
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
          </TooltipTrigger>
          <TooltipContent>
            <p className="">На этой странице нельзя изменить тип турнира</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
