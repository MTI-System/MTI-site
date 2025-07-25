"use client"
import { TextDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"
import { ReactNode } from "react"
import Loading from "@/app/(main)/loading"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setYear } from "@/redux_stores/SearchParamsSlice"
import { AddProblem } from "./ProblemForms"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

export default function ProblemFilters({ children, possibleYears }: { children: ReactNode; possibleYears: number[] }) {
  return <YearFilter possibleYears={possibleYears}>{children}</YearFilter>
}

function YearFilter({ children, possibleYears }: { children: ReactNode; possibleYears: number[] }) {
  const year = useAppSelector((state) => state.searchParams.year)
  const tt = useAppSelector((state) => state.searchParams.tt)
  const ttid = availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1
  const dispatcher = useAppDispatch()
  const isPending = useAppSelector((state) => state.system.isPending)

  return (
    <>
      <div className={style.filters}>
        <TextDropdown
          options={possibleYears.map((year) => {
            return { displayName: year.toString(), value: year, active: true }
          })}
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
      <AddProblem targetTTID={ttid} targetYear={year} />
      {!isPending && children}
      {isPending && <Loading />}
    </>
  )
}
