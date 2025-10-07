// "use client"
// import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
// import { startTransition, useEffect, useState, useTransition } from "react"
// import { usePathname, useSearchParams, useRouter } from "next/navigation"
// import { setTT } from "@/redux_stores/Global/SearchParamsSlice"
// import { setIsPending } from "@/redux_stores/Global/SystemSlice"
// import { fetchPermissions, fetchYears } from "@/scripts/ApiFetchers"
// import { setAuth } from "@/redux_stores/Global/AuthSlice"
// import cookies from "js-cookie"
// import {setSectionList, setYear} from "@/redux_stores/Problems/ProblemsFiltersSlice";
// import {useProblemsDispatch, useProblemsSelector} from "@/components/Redux/ProblemsStoreContext";
//
// function isDigit(char: string): boolean {
//   return /\d/.test(char)
// }
//
// export default function SearchParamsUpdator() {
//   const tt = useAppSelector((state) => state.searchParams.tt)
//   const year = useProblemsSelector((state) => state.problemsPageFilters.year)
//   const sectionList = useProblemsSelector((state) => state.problemsPageFilters.sectionList)
//   const get_last_year_func = async (usingTT: number) => {
//     const possibleYears = await fetchYears(usingTT ?? 1)
//     return possibleYears[0]
//   }
//
//   const [isPending, startTransition] = useTransition()
//   const searchParams = useSearchParams()
//   const pathname = usePathname()
//   const router = useRouter()
//   const dispatch = useAppDispatch()
//   const problemDispatcher = useProblemsDispatch()
//   const getSearchParams = useSearchParams()
//   const [isMounted, setIsMounted] = useState(false)
//   const availableTournamentTypes = useAppSelector(state=>state.searchParams.availableTournamentTypes) ?? []
//
//   useEffect(() => {
//     dispatch(setIsPending(isPending))
//   }, [isPending])
//
//   useEffect(() => {
//     let ttSP = getSearchParams.get("tt") ?? cookies.get("mtiyt_tournamentType") ?? availableTournamentTypes[0].id.toString()
//     const sectionsListFilter = getSearchParams.get("sections")
//     const params = new URLSearchParams(searchParams.toString())
//     if (ttSP) {
//       if (!availableTournamentTypes.find((t) => t.id.toString() === ttSP)) {
//         ttSP = "1"
//       }
//       params.set("tt", ttSP)
//       if (!year) {
//         get_last_year_func(Number(ttSP)).then((lastYear) => {
//           console.log("year", lastYear)
//           params.set("year", lastYear.toString())
//           const next = `${pathname}?${params.toString()}`
//           console.log("next rout", next)
//           if (next !== `${pathname}?${searchParams}`) {
//             router.replace(next)
//           }
//           problemDispatcher(setYear(Number(params.get("year")) ?? 2026))
//         })
//       } else {
//         params.set("year", year.toString())
//         const next = `${pathname}?${params.toString()}`
//         if (next !== `${pathname}?${searchParams}`) {
//           router.replace(next)
//         }
//       }
//     } else {
//       const ttSP = searchParams.get("tt") ?? cookies.get("mtiyt_tournamentType")
//       const yearSP = searchParams.get("year")
//     }
//
//     dispatch(setTT(Number(params.get("tt")) ?? 1))
//     problemDispatcher(setYear(Number(params.get("year")) ?? 2026))
//     problemDispatcher(
//       setSectionList(
//         sectionsListFilter
//           ?.split(",")
//           .filter((val) => val !== "")
//           .map((val: string) => Number(val)) ?? null,
//       ),
//     )
//     setIsMounted(true)
//   }, [])
//
//   useEffect(() => {
//     if (!isMounted) {
//       return
//     }
//     const updateSearchParams = () => {
//       const next = `${pathname}?${params.toString().replace(/%2C/g, ",")}`
//       if (next !== `${pathname}?${searchParams}`) {
//         startTransition(() => {
//           router.replace(next)
//         })
//       }
//     }
//
//     const params = new URLSearchParams(searchParams.toString())
//     console.log("Update", tt, year)
//     if (tt) {
//       params.set("tt", tt.toString())
//     }
//     if (sectionList) {
//       params.set("sections", sectionList.join(","))
//     } else {
//       params.delete("sections")
//     }
//     if (year) {
//       params.set("year", year.toString())
//       updateSearchParams()
//     } else {
//       get_last_year_func(tt ?? 1).then((lastYear) => {
//         params.set("year", lastYear.toString())
//         problemDispatcher(setYear(lastYear))
//         updateSearchParams()
//       })
//     }
//   }, [tt, year, sectionList])
//
//   return <></>
// }

"use client"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { setTT } from "@/redux_stores/Global/SearchParamsSlice"
import { setSectionList, setYear } from "@/redux_stores/Problems/ProblemsFiltersSlice"
import { useProblemsDispatch, useProblemsSelector } from "@/components/Redux/ProblemsStoreContext"
import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useInteractiveTransition } from "../Instinct/index.parts"

export default function SearchParamsUpdator({
  searchParams,
  isNoRefresh,
}: {
  searchParams: { year: string; tt: string; sections?: string }
  isNoRefresh: boolean
}) {
  const localDispatch = useProblemsDispatch()
  const dispatch = useAppDispatch()
  const tt = useAppSelector((state) => state.searchParams.tt)
  const year = useProblemsSelector((state) => state.problemsPageFilters.year)
  const sectionFilter = useProblemsSelector((state) => state.problemsPageFilters.sectionList)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setMounted] = useState(false)
  const [isPending, error, startTransition] = useInteractiveTransition()

  useEffect(() => {
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
    if (searchParams.sections) {
      console.log(
        "yes sections",
        searchParams.sections,
        searchParams.sections.split(",").map((el) => Number(el)),
      )
      localDispatch(setSectionList(searchParams.sections.split(",").map((el) => Number(el))))
    } else if (!sectionFilter) {
      console.log("not sections", searchParams.sections)
      localDispatch(setSectionList([]))
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("UPDATE SEARCH LINE", sectionFilter)
    if (!isMounted) return
    const params = new URLSearchParams()
    params.set("tt", tt?.toString() ?? "1")
    params.set("year", (year ?? 2025).toString())
    console.log("compare", params.toString(), new URLSearchParams(searchParams).toString())
    if (params.toString() == new URLSearchParams(searchParams).toString()) {
      return
    }
    if (sectionFilter) {
      params.set("sections", sectionFilter?.join(","))
    }
    if (isNoRefresh) {
      router.replace(`${pathname}?${params.toString()}`)
      return
    }
    startTransition(async () => {
      window.history.replaceState(null, "New Page Title", `${pathname}?${params.toString()}`)
    })
  }, [isMounted, year, tt, sectionFilter])
  return <></>
}
