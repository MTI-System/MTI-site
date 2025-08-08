"use client"
import { TextDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/components/sections/problems/problemsFilter.module.css"
import { ReactNode } from "react"
import Loading from "@/app/loading"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setYear } from "@/redux_stores/SearchParamsSlice"
import { AddProblem } from "./ProblemForms"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

export default function ProblemFilters({
  children,
  possibleYears,
  isModerator,
}: {
  children: ReactNode
  possibleYears: number[]
  isModerator: boolean
}) {
  const year = useAppSelector((state) => state.searchParams.year??possibleYears[0])
  const tt = useAppSelector((state) => state.searchParams.tt)
  const ttid = availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1
  const isPending = useAppSelector((state) => state.system.isPending)
  return (
    <>
      <div className={style.filters}>
        <p className={style.filtersTitle}>Задачи</p>
        <YearFilter possibleYears={possibleYears} isPending={isPending} isModerator={isModerator} />
      </div>
      <AddProblem targetTTID={ttid} targetYear={year} />
      {!isPending && children}
      {isPending && <Loading />}
    </>
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
  const year = useAppSelector((state) => state.searchParams.year)??possibleYears[0]
  const dispatcher = useAppDispatch()

  const optionList: { displayName: string; value: number; active: boolean }[] = []
  possibleYears.forEach((year, index, array) => {
    if (index === 0) {
      if (isModerator) optionList.push({ displayName: `+${year + 1}`, value: year + 1, active: true })
      optionList.push({ displayName: year.toString(), value: year, active: true })
      return
    }
    for (let i = year + 1; i < array[index - 1]; i++) optionList.push({ displayName: `+${i}`, value: i, active: true })
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
    <div className={style.yearFilter}>
      <TextDropdown
        options={optionList}
        defaultSelection={{
          displayName: year.toString(),
          value: year,
          active: true,
        }}
        onOptionSelect={(newValue) => {
          dispatcher(setYear(newValue))
        }}
        disabled={isPending}
      ></TextDropdown>
    </div>
  )
}
