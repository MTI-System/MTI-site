"use client"
import {useEffect, useState} from "react";
import {useTournamentsSelector, useTournamentsDispatch} from "@/components/Redux/tournamentsStoreContext";
import {useAppDispatch, useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {setTT} from "@/redux_stores/Global/SearchParamsSlice";
import {setPage, setState, setYear} from "@/redux_stores/Tournaments/TournamentsPageFiltersSlice";
import {TournamentState} from "@/types/TournamentStateType";
import {useGetAvailableYearsQuery} from "@/api/tournaments/clientApiInterface";

export default function TournamentsSearchParams(
  {searchParams}: {searchParams: { year: string; tt: string; page: string, state: TournamentState }
}) {
  const localDispatch = useTournamentsDispatch();
  const dispatch = useAppDispatch();
  const tt = useAppSelector(state=>state.searchParams.tt)
  const year =  useTournamentsSelector((state) => state.tournamentsPageFilters.year);
  const page =  useTournamentsSelector((state) => state.tournamentsPageFilters.page);
  const state = useTournamentsSelector(state=>state.tournamentsPageFilters.state);
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setMounted] = useState(false)
  useEffect(() => {
    console.log("TournamentsSearchParams loaded", searchParams)
    if (searchParams.tt){
      dispatch(setTT(Number(searchParams.tt)));
    }
    else if(!tt){
      dispatch(setTT(1));
    }
    if(searchParams.year){
      localDispatch(setYear(Number(searchParams.year)))
    }
    else if(!year){
      localDispatch(setYear(2026));
    }
    if(searchParams.page){
      console.log("UPDATE PARAMS",  searchParams.page);
      localDispatch(setPage(Number(searchParams.page)))
    }
    else if(!page){
      localDispatch(setPage(1))
    }
    if(searchParams.state){
      localDispatch(setState(searchParams.state))
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("UPDATE SEARCH LINE")
    if (!isMounted) return
    const params = new URLSearchParams()
    params.set("tt", tt?.toString() ?? "1");
    params.set("year", (year??2025).toString());
    params.set("page", (page??1).toString());
    params.set("state", state);
    router.replace(`${pathname}?${params.toString()}`);
  }, [isMounted, page, year, tt, state]);
  return <></>
}