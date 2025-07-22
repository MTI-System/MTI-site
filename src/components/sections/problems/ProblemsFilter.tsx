"use client"
import { StaticDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"
import { ReactNode, Suspense } from "react"
import Loading from "@/app/(main)/loading"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setYear } from "@/redux_stores/SearchParamsSlice"

export default function ProblemFilters({ children, possibleYears }: { children: ReactNode; possibleYears: number[] }) {
  return <YearFilter possibleYears={possibleYears}>{children}</YearFilter>
}

function YearFilter({ children, possibleYears }: { children: ReactNode; possibleYears: number[] }) {
  const year = useAppSelector((state) => state.searchParams.year)
  const dispatcher = useAppDispatch()
  const isPending = useAppSelector((state) => state.system.isPending)

  return (
    <>
      <div className={style.filters}>
        <StaticDropdown
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
        ></StaticDropdown>
      </div>
      {!isPending && children}
      {isPending && <Loading />}
    </>
  )
}
