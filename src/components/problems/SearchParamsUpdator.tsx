"use client"
import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { setTT } from "@/redux_stores/Global/SearchParamsSlice"
import { setSectionList, setTournamentFilter, setYear } from "@/redux_stores/Problems/ProblemsFiltersSlice"
import { useProblemsDispatch, useProblemsSelector } from "@/components/Redux/ProblemsStoreContext"
import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { setIsPending } from "@/redux_stores/Global/SystemSlice"

export default function SearchParamsUpdator({
  searchParams,
  isNoRefresh,
}: {
  searchParams: { year: string; tt: string; sections?: string; tournament?: string }
  isNoRefresh: boolean
}) {
  const localDispatch = useProblemsDispatch()
  const dispatch = useAppDispatch()
  const tt = useAppSelector((state) => state.searchParams.tt)
  const year = useProblemsSelector((state) => state.problemsPageFilters.year)
  const sectionFilter = useProblemsSelector((state) => state.problemsPageFilters.sectionList)
  const tournament = useProblemsSelector((state) => state.problemsPageFilters.tournament)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isNoRefreshInternal, setIsNoRefreshInternal] = useState(isNoRefresh)

  useEffect(() => {
    dispatch(setIsPending(isPending))
  }, [isPending])

  useEffect(() => {
    console.log("newsp", searchParams)
    if (searchParams.tt) {
      dispatch(setTT(Number(searchParams.tt)))
    } else if (!tt) {
      dispatch(setTT(1))
    }
    if (searchParams.year) {
      localDispatch(setYear(Number(searchParams.year)))
    } else if (!year) {
      localDispatch(setYear(2026))
    }
    if (searchParams.tournament) {
      localDispatch(setTournamentFilter(Number(searchParams.tournament)))
    } else {
      localDispatch(setTournamentFilter(null))
    }

    if (searchParams.sections) {
      localDispatch(setSectionList(searchParams.sections.split(",").map((el) => Number(el))))
    } else {
      localDispatch(setSectionList(null))
    }

    setMounted(true)
  }, [searchParams])

  useEffect(() => {
    console.log("UPDATE SEARCH LINE", sectionFilter)
    if (!isMounted) return
    const params = new URLSearchParams()
    params.set("tt", tt?.toString() ?? "1")
    params.set("year", (year ?? 2025).toString())
    if (sectionFilter && year === Number(searchParams.year)) {
      params.set("sections", sectionFilter?.join(",") ?? "")
    }
    if (tournament && year === Number(searchParams.year)) {
      params.set("tournament", tournament.toString())
    }
    if (sectionFilter && year === Number(searchParams.year)) {
      params.set("sections", sectionFilter?.join(","))
    }
    console.log("compare", params.toString(), new URLSearchParams(searchParams).toString())
    if (params.toString() == new URLSearchParams(searchParams).toString()) {
      return
    }

    if (isNoRefreshInternal) {
      window.history.replaceState(null, "Problems", `${pathname}?${params.toString()}`)
      setIsNoRefreshInternal(false)
      return
    }

    startTransition(async () => {
      await router.replace(`${pathname}?${params.toString()}`)
    })
  }, [isMounted, year, tt, sectionFilter, tournament])
  return <></>
}
