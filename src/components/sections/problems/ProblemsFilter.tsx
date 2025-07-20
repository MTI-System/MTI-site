"use client"
import { StaticDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"
import useSearchParam from "@/hooks/useSearchParam"
import { ReactNode } from "react"

export default function ProblemFilters({ children, possibleYears }: { children: ReactNode; possibleYears: number[] }) {
  return <YearFilter possibleYears={possibleYears}>{children}</YearFilter>
}

function YearFilter({ children, possibleYears }: { children: ReactNode; possibleYears: number[] }) {
  const [isPending, yearParam, setYearParam] = useSearchParam("year")
  let year = yearParam
  if (!year) year = possibleYears[0].toString()

  // const yearsArray = fetchYears()
  // setYearParam(year)
  return (
    <>
      {" "}
      <div className={style.filters}>
        <StaticDropdown
          options={possibleYears.map((year) => {
            return { displayName: year.toString(), value: year, active: true }
          })}
          defaultSelection={{
            displayName: year,
            value: parseInt(year),
            active: true,
          }}
          onOptionSelect={(newValue) => {
            setYearParam(newValue.toString())
          }}
          disabled={isPending}
        ></StaticDropdown>
      </div>
      {!isPending && children}
    </>
  )
}
