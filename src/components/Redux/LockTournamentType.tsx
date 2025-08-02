"use client"
import {useDispatch} from "react-redux";
import {setIsTTLocked, setTT} from "@/redux_stores/SearchParamsSlice";
import {useEffect} from "react";

export default function LockTournamentType({tt}: { tt: string }) {
  const dispatcher = useDispatch()
  useEffect(() => {
    dispatcher(setTT(tt))
    dispatcher(setIsTTLocked(true))
  }, [dispatcher]);

  return <></>
}