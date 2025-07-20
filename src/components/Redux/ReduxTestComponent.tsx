"use client"
import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {setTT} from "@/redux_stores/TournamentTypeSlice";
import {useEffect} from "react";
import useSearchParam from "@/hooks/useSearchParam";
import {TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";
import {setYear} from "@/redux_stores/YearSlice";

export default function ReduxTestComponent() {
  const tt = useAppSelector(state => state.tt.tt)
  const year = useAppSelector(state => state.year.year)
  const reduxDispatch = useAppDispatch()

  return <>
    <button onClick={
      () => {
        reduxDispatch(setTT("ТЮФ"))
      }
    }>ТЮФ
    </button>
    <button onClick={
      () => {
        reduxDispatch(setTT("ТЮЕ"))
      }
    }>ТЮЕ
    </button>
    <button onClick={
      () => {
        reduxDispatch(setYear(2026))
      }
    }>2026
    </button>
    <button onClick={
      () => {
        reduxDispatch(setYear(2024))
      }
    }>2024
    </button>
  </>
}