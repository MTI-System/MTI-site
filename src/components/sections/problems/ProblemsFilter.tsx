"use client"
import { StaticDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"
import useSearchParam from "@/hooks/useSearchParam"

export default function ProblemFilters({ possibleYears }: { possibleYears: number[] }) {
  return <YearFilter possibleYears={possibleYears} />
}

function YearFilter({ possibleYears }: { possibleYears: number[] }) {
  const [yearParam, setYearParam] = useSearchParam("year")
  let year = yearParam
  if (!year) year = possibleYears[0].toString()

  // const yearsArray = fetchYears()
  // setYearParam(year)
  return (
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
      ></StaticDropdown>
    </div>
  )
}
