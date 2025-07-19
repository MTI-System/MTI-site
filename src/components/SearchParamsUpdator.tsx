"use client"
import {useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {startTransition, useEffect} from "react";
import useSearchParam from "@/hooks/useSearchParam";
import {TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import * as sea from "node:sea";
import {collectSegmentData} from "next/dist/server/app-render/collect-segment-data";

export default function SearchParamsUpdator(){
  const tt = useAppSelector(state => state.tt.tt)
  const year = useAppSelector(state => state.year.year)
  const searchParams = useSearchParams()
  const pathname     = usePathname()
  const router = useRouter()
  useEffect(()=>{
    const params = new URLSearchParams(searchParams.toString())
    params.set("tt", tt)
    params.set("year", year.toString())
    const next = `${pathname}?${params.toString()}`
    if (next !== `${pathname}?${searchParams}`) {
      // router.replace(next)

      //ЭКСПЕРИМЕНТ
      router.prefetch(next)
      router.replace(next)
      //ЭКСПЕРИМЕНТ
    }
    console.log("update", tt, year)
  }, [tt, year, pathname, searchParams, router, startTransition])

  return <></>
}