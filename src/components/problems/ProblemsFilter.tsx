"use client"
import {
  Dropdown,
  DropdownElement,
  DropdownMulti,
  DropdownMultiElement,
  DropdownOptionInterface,
  DropdownTrigger,
} from "@/components/ui/Dropdown"
import style from "@/styles/components/sections/problems/problemsFilter.module.css"
import { ReactNode, useEffect, useState } from "react"
import Loading from "@/app/loading"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setSectionList, setYear } from "@/redux_stores/SearchParamsSlice"
import { AddProblem } from "./ProblemForms"
import LogoWithTT from "../ui/LogoWithTT"
import { ProblemSectionInterface } from "@/types/problemAPI"
import ProblemSection from "./ProblemSection"
import { FaTimes } from "react-icons/fa"
import twclsx from "@/utils/twClassMerge"
import { Menu } from "@base-ui-components/react"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

export default function ProblemFilters({
  children,
  possibleYears,
  possibleSections,
  isModerator,
}: {
  children: ReactNode
  possibleYears: number[]
  possibleSections: ProblemSectionInterface[]
  isModerator: boolean
}) {
  const year = useAppSelector((state) => state.searchParams.year ?? possibleYears[0])
  const tt = useAppSelector((state) => state.searchParams.tt)
  const ttid = availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1
  const isPending = useAppSelector((state) => state.system.isPending)
  return (
    <>
      <div className="flex h-fit w-full content-center items-center gap-5">
        <p className={style.filtersTitle}>Задачи</p>
        <LogoWithTT logoSize={"2rem"} margin={"0rem"}>
          <></>
        </LogoWithTT>
        <div className={style.filters}>
          <YearFilter possibleYears={possibleYears} isPending={isPending} isModerator={isModerator} />
          <SectionFilter possibleSections={possibleSections} isPending={isPending}></SectionFilter>
        </div>
      </div>
      <AddProblem targetTTID={ttid} targetYear={year} />
      {!isPending && children}
      {isPending && <Loading />}
    </>
  )
}

function SectionFilter({
  possibleSections,
  isPending,
}: {
  possibleSections: ProblemSectionInterface[]
  isPending: boolean
}) {
  const year = useAppSelector((state) => state.searchParams.year)
  const tt = useAppSelector((state) => state.searchParams.tt)
  const sectionList = useAppSelector((state) => state.searchParams.sectionList)
  const dispatcher = useAppDispatch()

  const [selectedOptions, setSelectedOption] = useState<number[]>([])

  useEffect(() => {
    setSelectedOption(sectionList ?? [])
  }, [sectionList])

  useEffect(() => {
    setSelectedOption([])
    dispatcher(setSectionList(null))
  }, [year, tt])

  return (
    <div className="flex w-full min-w-0 content-center items-center">
      <DropdownMulti
        onOpenChange={(open, e, selection: DropdownOptionInterface<number>[] | null) => {
          if (open) return
          dispatcher(setSectionList(selection?.map((s) => s.value) ?? null))
        }}
        trigger={
          <DropdownTrigger rootClassName="flex-1" disabled={isPending}>
            {isPending ? <p className="flex-1">Выбираем...</p> : <p className="flex-1">Выбрать разделы</p>}
          </DropdownTrigger>
        }
      >
        {possibleSections.map((section, i) => (
          <DropdownMultiElement value={section.id} key={i + 1}>
            <div className="grid cursor-default grid-cols-[2rem_1fr] items-center gap-1">
              <Menu.CheckboxItemIndicator className="col-start-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={section.tile_color}>
                  <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
                </svg>
              </Menu.CheckboxItemIndicator>
              <ProblemSection key={section.id} section={section} className="col-start-2" />
            </div>
          </DropdownMultiElement>
        ))}
      </DropdownMulti>
      <FaTimes
        className={twclsx("w-20 text-[1.5rem]", {
          "text-[var(--alt-text)]": isPending || selectedOptions.length === 0,
          "hover:text-[var(--alt-text)]": !isPending && selectedOptions.length !== 0,
        })}
        onClick={() => {
          if (isPending || selectedOptions.length === 0) return
          setSelectedOption([])
          dispatcher(setSectionList(null))
        }}
      />
    </div>
  )
}

function YearFilter({
  possibleYears,
  isPending,
  isModerator,
}: {
  possibleYears: number[]
  isPending: boolean
  isModerator: boolean
}) {
  const year = useAppSelector((state) => state.searchParams.year) ?? possibleYears[0]
  const dispatcher = useAppDispatch()

  const optionList: { children: string; value: number; active: boolean }[] = []
  possibleYears.forEach((year, index, array) => {
    if (index === 0) {
      if (isModerator)
        optionList.push({
          children: `+${year + 1}`,
          value: year + 1,
          active: true,
        })
      optionList.push({
        children: year.toString(),
        value: year,
        active: true,
      })
      return
    }
    if (isModerator)
      for (let i = year + 1; i < array[index - 1]; i++) optionList.push({ children: `+${i}`, value: i, active: true })
    optionList.push({ children: year.toString(), value: year, active: true })
  })
  if (isModerator) {
    const firstYear = possibleYears.length > 0 ? possibleYears[possibleYears.length - 1] : new Date().getFullYear() + 1
    optionList.push({
      children: `+${firstYear - 1}`,
      value: firstYear - 1,
      active: true,
    })
  }

  return (
    <Dropdown
      trigger={<DropdownTrigger disabled={isPending}>{year}</DropdownTrigger>}
      onOptionSelect={(option: DropdownOptionInterface<number> | null) => {
        if (!option) return
        dispatcher(setYear(option.value))
      }}
    >
      {optionList.map((opts, i) => (
        <DropdownElement key={i + 1} {...opts} />
      ))}
    </Dropdown>
  )
}
