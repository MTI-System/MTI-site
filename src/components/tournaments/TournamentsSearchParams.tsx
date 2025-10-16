"use client"
import { useEffect, useState, useTransition } from "react"
import { useTournamentsSelector, useTournamentsDispatch } from "@/components/Redux/tournamentsStoreContext"
import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { setTT } from "@/redux_stores/Global/SearchParamsSlice"
import { setPage, setState, setYear } from "@/redux_stores/Tournaments/TournamentsPageFiltersSlice"
import { TournamentState } from "@/types/TournamentStateType"
import { useGetAvailableYearsQuery } from "@/api/tournaments/clientApiInterface"
import { setIsPending } from "@/redux_stores/Global/SystemSlice"

export default function TournamentsSearchParams({
  searchParams,
  isNoRefresh,
}: {
  searchParams: { year: string; tt: string; page: string; state: TournamentState }
  isNoRefresh: boolean
}) {
  const localDispatch = useTournamentsDispatch()
  const dispatch = useAppDispatch()
  const tt = useAppSelector((state) => state.searchParams.tt)
  const year = useTournamentsSelector((state) => state.tournamentsPageFilters.year)
  const page = useTournamentsSelector((state) => state.tournamentsPageFilters.page)
  const state = useTournamentsSelector((state) => state.tournamentsPageFilters.state)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isNoRefreshInternal, setIsNoRefreshInternal] = useState(isNoRefresh)
  useEffect(() => {
    dispatch(setIsPending(isPending))
  }, [isPending])
  useEffect(() => {
    console.log("TournamentsSearchParams loaded", searchParams)
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
    if (searchParams.page) {
      console.log("UPDATE PARAMS", searchParams.page)
      localDispatch(setPage(Number(searchParams.page)))
    } else if (!page) {
      localDispatch(setPage(1))
    }
    if (searchParams.state) {
      localDispatch(setState(searchParams.state))
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("UPDATE SEARCH LINE")
    if (!isMounted) return
    const params = new URLSearchParams()
    params.set("tt", tt?.toString() ?? "1")
    params.set("year", (year ?? 2025).toString())
    params.set("state", state)
    params.set("page", (page ?? 1).toString())
    if (params.toString() == new URLSearchParams(searchParams).toString()) {
      return
    }
    if (isNoRefreshInternal) {
      window.history.replaceState(null, "Tournaments", `${pathname}?${params.toString()}`)
      setIsNoRefreshInternal(false)
      return
    }

    startTransition(async () => {
      await router.replace(`${pathname}?${params.toString()}`)
    })
  }, [isMounted, page, year, tt, state])
  return <></>
}
