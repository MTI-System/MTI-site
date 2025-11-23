"use client"
import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useEffect, useState } from "react"
import headerStyle from "@/styles/components/sections/app/header.module.css"
import cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { Dropdown, DropdownElement, DropdownOptionInterface, DropdownTrigger } from "../ui/Dropdown"
import ColoredTType from "../ui/ColoredTType"
import { setAvailableTournamentTypes, setTT } from "@/redux_stores/Global/SearchParamsSlice"
import { TOURNAMENT_TYPE_KEY_NAME } from "@/constants/CookieKeys"
import { Tooltip } from "@base-ui-components/react"
import { setYear } from "@/redux_stores/Problems/ProblemsFiltersSlice"
import { TournamentTypeIntarface } from "@/types/TournamentTypeIntarface"

export default function TournamentTypeSelector({
  initTournamentType,
  availableTournamentTypes,
}: {
  initTournamentType: number
  availableTournamentTypes: TournamentTypeIntarface[]
}) {
  // const availableTournamentTypes = useAppSelector((state) => state.searchParams.availableTournamentTypes) ?? []
  const ttddElements = availableTournamentTypes.map((value) => ({
    id: value.id,
    children: (
      <ColoredTType ttColor={value.color} ttName={value.name} className="text-text-main text-[1.8rem] font-bold" />
    ),
    value: value.name,
  }))

  const tt = useAppSelector((state) => state.searchParams.tt)
  const isPending = useAppSelector((state) => state.system.isPending)
  const dispatcher = useAppDispatch()
  const [isTTLocked, setIsTTLocked] = useState(false)
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  const selectedState = useState<DropdownOptionInterface<string> | null>(
    ttddElements.find((e) => {
      return e.id === initTournamentType
    }) ?? null,
  )

  console.log("asdfqwe", initTournamentType, Number(initTournamentType))

  // useEffect( ()=>{
  //   dispatcher(setAvailableTournamentTypes(availableTournamentTypes))
  // }, []
  // )
  useEffect(() => {
    console.log("bbbb", selectedState)
  }, [selectedState])

  const lockedPages = ["/problems/"]

  useEffect(() => {
    selectedState[1](ttddElements.find((e) => e.id === tt) ?? null)
  }, [tt])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) {
      return
    }
    lockedPages.forEach((page) => {
      setIsTTLocked(lockedPages.some((path) => pathname.startsWith(path)))
    })
  }, [pathname, hasMounted])

  return (
    <div className={headerStyle.hoverTextContainer}>
      <Dropdown
        selectionState={selectedState}
        trigger={
          <Tooltip.Provider>
            <Tooltip.Root disabled={!isTTLocked} >
              <Tooltip.Trigger render={<div></div>}>
                <DropdownTrigger className="border-none" disabled={isPending || isTTLocked}>
                  {selectedState[0]?.value}
                </DropdownTrigger>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="right">
                  <Tooltip.Popup className="border-border bg-bg-alt flex origin-[var(--transform-origin)] flex-col rounded-md border-2 px-2 py-1 text-sm shadow-[0_0_0.5rem_0.2rem_rgba(0,0,0,0.25)] transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-[0_0_0.5rem_0.2rem_rgba(255,255,255,0.25)]">
                    <p className="text-text-main">На этой странице нельзя изменить тип турнира</p>
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        }
        onOptionSelect={(option) => {
          if (!option) return
          cookies.set(TOURNAMENT_TYPE_KEY_NAME, option.value)
          dispatcher(setYear(null))
          dispatcher(setTT(Number(option.value)))
        }}
      >
        {ttddElements.map((e, i) => (
          <DropdownElement value={e.id} key={i + 1}>
            {e.children}
          </DropdownElement>
        ))}
      </Dropdown>
    </div>
  )
}
