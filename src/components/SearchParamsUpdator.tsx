"use client"
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {startTransition, useEffect, useTransition} from "react";
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import {setTT, setYear} from "@/redux_stores/SearchParamsSlice";
import {setIsPending} from "@/redux_stores/SystemSlice";

export default function SearchParamsUpdator() {
  const tt = useAppSelector(state => state.searchParams.tt)
  const year = useAppSelector(state => state.searchParams.year)
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log("Update isPending", isPending)
    dispatch(setIsPending(isPending))
  }, [isPending]);

  useEffect(() => {
    const ttSP = searchParams.get("tt");
    const yearSP = searchParams.get("year");
    if (ttSP) {
      dispatch(setTT(ttSP));
    }
    if (yearSP) {
      dispatch(setYear(Number(yearSP)));
    }

  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tt", tt)
    params.set("year", year.toString())
    const next = `${pathname}?${params.toString()}`
    if (next !== `${pathname}?${searchParams}`) {
      startTransition(() => {
        router.replace(next)
      })
    }
    console.log("update", tt, year)
  }, [tt, year, pathname, searchParams, router, startTransition])

  return <></>
}