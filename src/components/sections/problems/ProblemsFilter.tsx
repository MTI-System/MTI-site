"use client"
import { StaticDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"
import useSearchParam from "@/hooks/useSearchParam"
import { DEFAULT_YEAR } from "@/constants/DefaultProblemFilters"

export default function ProblemFilters() {
  return <YearFilter />
}

function YearFilter() {
  const [yearParam, setYearParam] = useSearchParam("year")
  let year = yearParam
  if (!year) year = DEFAULT_YEAR.toString()

  return (
    <div className={style.filters}>
      <StaticDropdown
        options={[
          { displayName: "2026", value: 2026, active: true },
          { displayName: "2025", value: 2025, active: true },
          { displayName: "2024", value: 2024, active: true },
        ]}
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
