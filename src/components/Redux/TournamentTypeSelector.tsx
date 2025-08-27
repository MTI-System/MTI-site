"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/redux_stores/tournamentTypeRedixStore"
import { useEffect, useState } from "react"
import headerStyle from "@/styles/components/sections/app/header.module.css"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { usePathname } from "next/navigation"
import {
  Dropdown,
  DropdownElement,
  DropdownOptionInterface,
  DropdownTrigger,
} from "../ui/Dropdown"

export default function TournamentTypeSelector({
  className,
}: {
  className?: string
}) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const isPending = useAppSelector((state) => state.system.isPending)
  const dispatcher = useAppDispatch()
  const [isTTLocked, setIsTTLocked] = useState(false)
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)
  const selectedState = useState<DropdownOptionInterface<string> | null>(null)
  const [selected, setSelected] = selectedState

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

  useEffect(() => {}, [isTTLocked])
  return (
    <>
      {/* TODO: Implement auto loading value and insert new component */}
      <div className={headerStyle.hoverTextContainer}>
        <Tooltip disabled={!isTTLocked}>
          <TooltipTrigger>
            <Dropdown
              selectionState={selectedState}
              trigger={
                <DropdownTrigger className="border-none bg-transparent hover:bg-transparent">
                  <div>Test trigger</div>
                </DropdownTrigger>
              }
            >
              <DropdownElement value="ТЮФ">Test ТЮФ 123</DropdownElement>
              <DropdownElement value="ТЮЕ">Test ТЮЕ</DropdownElement>
            </Dropdown>
          </TooltipTrigger>
          <TooltipContent>
            <p className={headerStyle.hoverText}>
              На этой странице нельзя изменить тип турнира
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
