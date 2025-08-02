"use client"
import {useDispatch} from "react-redux";
import {setIsTTLocked, setTT} from "@/redux_stores/SearchParamsSlice";
import {useEffect} from "react";

export default function UnlockTournamentType() {
  const dispatcher = useDispatch()
  useEffect(() => {
    dispatcher(setIsTTLocked(false))
  }, [dispatcher]);

  return <></>
}