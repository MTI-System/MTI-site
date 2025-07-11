"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { startTransition } from "react"
import { StaticDropdown } from "@/components/ui/Dropdown"
import style from "@/styles/problems/problemsFilter.module.css"

export default function ProblemFilter({ year }: { year: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  function onChangeYear(newYear: number) {
    const newParams = new URLSearchParams(search)
    newParams.set("year", newYear.toString())
    startTransition(() => {
      router.replace(`${pathname}?${newParams.toString()}`)
    })
  }

  return (
    <div className={style.filters}>
      <StaticDropdown
        options={[
          { displayName: "2026", value: 2026, active: true },
          { displayName: "2025", value: 2025, active: true },
          { displayName: "2024", value: 2024, active: true },
        ]}
        defaultSelection={{ displayName: year.toString(), value: year, active: true }}
        onOptionSelect={onChangeYear}
      ></StaticDropdown>
    </div>
  )
}
