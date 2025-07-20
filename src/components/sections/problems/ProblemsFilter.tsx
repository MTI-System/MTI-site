"use client"
import {StaticDropdown} from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"
import useSearchParam from "@/hooks/useSearchParam"
import {ReactNode, Suspense} from "react";
import Loading from "@/app/(main)/loading";
import {PROBLEM_API} from "@/constants/APIEndpoints";
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {setYear} from "@/redux_stores/YearSlice";

export default function ProblemFilters({children, possibleYears}: { children: ReactNode; possibleYears: number[] }) {
  return <YearFilter possibleYears={possibleYears}>
    {children}
  </YearFilter>
}

function YearFilter({children, possibleYears}: { children: ReactNode; possibleYears: number[] }) {
  const year = useAppSelector(state => state.year.year)
  const dispatcher = useAppDispatch()
  const isPending = false
  // const yearsArray = fetchYears()
  // setYearParam(year)
  return (
    <>
      <div className={style.filters}>
        <StaticDropdown
          options={
            possibleYears.map(year => {
              return ({displayName: year.toString(), value: year, active: true})
            })}
          defaultSelection={{
            displayName: year.toString(),
            value: year,
            active: true,
          }}
          onOptionSelect={(newValue) => {
            dispatcher(setYear(newValue))
          }}
        ></StaticDropdown>
      </div>
      {!isPending && children}
    </>
  )
}


