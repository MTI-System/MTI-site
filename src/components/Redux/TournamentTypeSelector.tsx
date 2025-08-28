"use client"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { useEffect, useState } from "react"
import headerStyle from "@/styles/components/sections/app/header.module.css"
import cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { Dropdown, DropdownElement, DropdownOptionInterface, DropdownTrigger } from "../ui/Dropdown"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import ColoredTType from "../ui/ColoredTType"
import { setTT, setYear } from "@/redux_stores/SearchParamsSlice"
import { TOURNAMENT_TYPE_KEY_NAME } from "@/constants/CookieKeys"
import { Tooltip } from "@base-ui-components/react"

export default function TournamentTypeSelector() {
  const ttddElements = availableTournamentTypes.map((value) => ({
    children: (
      <p className="text-text-main text-[1.8rem] font-bold">
        <ColoredTType ttColor={value.color} ttName={value.name} />
      </p>
    ),
    value: value.name,
  }))

  const tt = useAppSelector((state) => state.searchParams.tt)
  const isPending = useAppSelector((state) => state.system.isPending)
  const dispatcher = useAppDispatch()
  const [isTTLocked, setIsTTLocked] = useState(false)
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)
  const selectedTT = availableTournamentTypes.find((t) => tt === t.name)
  const selectedState = useState<DropdownOptionInterface<string> | null>(
    ttddElements.find((e) => e.value === selectedTT?.name) ?? null,
  )

  const lockedPages = ["/problems/"]

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
            <Tooltip.Root disabled={!isTTLocked}>
              <Tooltip.Trigger render={<div></div>}>
                <DropdownTrigger className="border-none" disabled={isPending || isTTLocked}>
                  <div>...</div>
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
          console.log(option.value)
          cookies.set(TOURNAMENT_TYPE_KEY_NAME, option.value)
          dispatcher(setYear(null))
          dispatcher(setTT(option.value))
        }}
      >
        {ttddElements.map((e, i) => (
          <DropdownElement value={e.value} key={i + 1}>
            {e.children}
          </DropdownElement>
        ))}
      </Dropdown>
    </div>
  )
}
