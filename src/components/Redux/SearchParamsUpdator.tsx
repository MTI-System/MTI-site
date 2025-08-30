"use client"
import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { startTransition, useEffect, useState, useTransition } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { setSectionList, setTT, setYear } from "@/redux_stores/Global/SearchParamsSlice"
import { setIsPending } from "@/redux_stores/Global/SystemSlice"
import { fetchPermissions, fetchYears } from "@/scripts/ApiFetchers"
import { setAuth } from "@/redux_stores/Global/AuthSlice"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import cookies from "js-cookie"

function isDigit(char: string): boolean {
  return /\d/.test(char)
}

export default function SearchParamsUpdator() {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const year = useAppSelector((state) => state.searchParams.year)
  const sectionList = useAppSelector((state) => state.searchParams.sectionList)
  const get_last_year_func = async (usingTT: string) => {
    const possibleYears = await fetchYears(Number(availableTournamentTypes.find((t) => t.name === usingTT)?.id ?? 1))
    return possibleYears[0]
  }

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const getSearchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    dispatch(setIsPending(isPending))
  }, [isPending])

  useEffect(() => {
    let ttSP = getSearchParams.get("tt") ?? cookies.get("mtiyt_tournamentType") ?? availableTournamentTypes[0].name
    const sectionsListFilter = getSearchParams.get("sections")
    const params = new URLSearchParams(searchParams.toString())
    if (ttSP) {
      if (!availableTournamentTypes.find((t) => t.name === ttSP)) {
        ttSP = "ТЮФ"
      }
      params.set("tt", ttSP)
      if (!year) {
        get_last_year_func(ttSP).then((lastYear) => {
          console.log("year", lastYear)
          params.set("year", lastYear.toString())
          const next = `${pathname}?${params.toString()}`
          console.log("next rout", next)
          if (next !== `${pathname}?${searchParams}`) {
            router.replace(next)
          }
          dispatch(setYear(Number(params.get("year")) ?? 2026))
        })
      } else {
        params.set("year", year.toString())
        const next = `${pathname}?${params.toString()}`
        if (next !== `${pathname}?${searchParams}`) {
          router.replace(next)
        }
      }
    } else {
      const ttSP = searchParams.get("tt") ?? cookies.get("mtiyt_tournamentType")
      const yearSP = searchParams.get("year")
    }

    dispatch(setTT(params.get("tt") ?? "ТЮФ"))
    dispatch(setYear(Number(params.get("year")) ?? 2026))
    dispatch(
      setSectionList(
        sectionsListFilter
          ?.split(",")
          .filter((val) => val !== "")
          .map((val: string) => Number(val)) ?? null,
      ),
    )
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }
    const updateSearchParams = () => {
      const next = `${pathname}?${params.toString().replace(/%2C/g, ",")}`
      if (next !== `${pathname}?${searchParams}`) {
        startTransition(() => {
          router.replace(next)
        })
      }
    }

    const params = new URLSearchParams(searchParams.toString())
    console.log("Update", tt, year)
    if (tt) {
      params.set("tt", tt)
    }
    if (sectionList) {
      params.set("sections", sectionList.join(","))
    } else {
      params.delete("sections")
    }
    if (year) {
      params.set("year", year.toString())
      updateSearchParams()
    } else {
      get_last_year_func(tt ?? "ТЮФ").then((lastYear) => {
        params.set("year", lastYear.toString())
        dispatch(setYear(lastYear))
        updateSearchParams()
      })
    }
  }, [tt, year, sectionList])

  return <></>
}
