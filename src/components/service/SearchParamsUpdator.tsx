"use client"
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {startTransition, useEffect, useState, useTransition} from "react";
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import {setTT, setYear} from "@/redux_stores/SearchParamsSlice";
import {setIsPending} from "@/redux_stores/SystemSlice";
import {fetchPermissions, fetchYears} from "@/scripts/ApiFetchers";
import {setAuth} from "@/redux_stores/AuthSlice";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";
import cookies from "js-cookie";

export default function SearchParamsUpdator() {
  const tt = useAppSelector(state => state.searchParams.tt)
  const year = useAppSelector(state => state.searchParams.year)
  const get_last_year_func = async (usingTT: string) => {
    const possibleYears = await fetchYears(Number(availableTournamentTypes.find(t => t.name === usingTT)?.id ?? 1))
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
  }, [isPending]);

  useEffect(() => {
    const ttSP = getSearchParams.get("tt") ?? cookies.get("mtiyt_tournamentType") ?? availableTournamentTypes[0].name;
    const params = new URLSearchParams(searchParams.toString())
    console.log(ttSP, year)
    if (ttSP) {
      params.set("tt", ttSP)
      if (!year) {
        get_last_year_func(ttSP).then(lastYear => {
          console.log("year", lastYear)
          params.set("year", lastYear.toString())
          const next = `${pathname}?${params.toString()}`
          console.log("next rout", next)
          if (next !== `${pathname}?${searchParams}`) {
            router.replace(next)
          }
        })
      } else {
        params.set("year", year.toString())
        const next = `${pathname}?${params.toString()}`
        if (next !== `${pathname}?${searchParams}`) {
          router.replace(next)
        }
      }
    } else {
      const ttSP = searchParams.get("tt") ?? cookies.get("mtiyt_tournamentType");
      const yearSP = searchParams.get("year");
      dispatch(setTT(ttSP ?? "ТЮФ"), setYear(Number(yearSP)));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return
    }
    const updateSearchParams = () => {
      const next = `${pathname}?${params.toString()}`
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
    if (year) {
      params.set("year", year.toString())
      updateSearchParams()
    } else {
      get_last_year_func(tt ?? "ТЮФ").then(lastYear => {
        params.set("year", lastYear.toString())
        dispatch(setYear(lastYear))
        updateSearchParams()
      })
    }
  }, [tt, year])

  return <></>
}