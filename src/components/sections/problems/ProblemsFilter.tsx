"use client"
import { Dropdown, TextDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/components/sections/problems/problemsFilter.module.css"
import { ReactNode, useEffect, useState } from "react"
import Loading from "@/app/loading"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setSectionList, setYear } from "@/redux_stores/SearchParamsSlice"
import { AddProblem } from "./ProblemForms"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import LogoWithTT from "../app/LogoWithTT"
import { ProblemSectionInterface } from "@/types/problemAPI"
import ProblemSection from "./ProblemSection"
import clsx from "clsx"

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
      <div className="flex items-center content-center gap-5 w-full">
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
    <Dropdown
      options={possibleSections.map((section) => {
        return {
          displayElement: (
            <div
              className={clsx(style.addSectionOptionContainer, {
                [style.selectedSection]: selectedOptions.find((v) => v === section.id) !== undefined,
              })}
            >
              <ProblemSection key={section.id} section={section} />
            </div>
          ),
          value: section.id,
          active: true,
        }
      })}
      defaultSelection={{
        displayElement: (
          <div className={style.defaultOption}>
            {isPending ? (
              <p>Выбираем...</p>
            ) : selectedOptions.length > 0 ? (
              <p>
                Выбрано:{" "}
                {selectedOptions
                  .map((selected) => possibleSections.find((sec) => sec.id === selected)?.title)
                  .join(", ")}
              </p>
            ) : (
              <p>Выбрать разделы</p>
            )}
          </div>
        ),
        value: null,
        active: true,
      }}
      onOptionSelect={(e) => {
        e.isDefaultPrevented = true
        const elem = selectedOptions.find((v) => v === e.selection)
        if (elem === undefined)
          setSelectedOption((prev) => {
            if (!e.selection) return prev
            return [...prev, e.selection]
          })
        else
          setSelectedOption((prev) => {
            return [...prev.filter((v) => v !== e.selection)]
          })
      }}
      onToggle={async (isOpened) => {
        if (isOpened) return
        dispatcher(setSectionList(selectedOptions.length === 0 ? null : selectedOptions))
      }}
      className={style.selectSectionDropdown}
      disabled={isPending}
    />
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

  const optionList: { displayName: string; value: number; active: boolean }[] = []
  possibleYears.forEach((year, index, array) => {
    if (index === 0) {
      if (isModerator) optionList.push({ displayName: `+${year + 1}`, value: year + 1, active: true })
      optionList.push({ displayName: year.toString(), value: year, active: true })
      return
    }
    if (isModerator)
      for (let i = year + 1; i < array[index - 1]; i++)
        optionList.push({ displayName: `+${i}`, value: i, active: true })
    optionList.push({ displayName: year.toString(), value: year, active: true })
  })
  if (isModerator) {
    const firstYear = possibleYears.length > 0 ? possibleYears[possibleYears.length - 1] : new Date().getFullYear() + 1
    optionList.push({
      displayName: `+${firstYear - 1}`,
      value: firstYear - 1,
      active: true,
    })
  }

  return (
    <TextDropdown
      options={optionList}
      defaultSelection={{
        displayName: year.toString(),
        value: year,
        active: true,
      }}
      onOptionSelect={(e) => {
        dispatcher(setYear(e.selection))
      }}
      disabled={isPending}
      className={style.yearFilter}
    ></TextDropdown>
  )
}
