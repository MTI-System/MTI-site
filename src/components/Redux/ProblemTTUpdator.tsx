"use client"

import { setTT } from "@/redux_stores/Global/SearchParamsSlice"
import { useAppDispatch } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useEffect } from "react"

export default function ProblemTTUpdator({ newTT }: { newTT: string }) {
  const dispatcher = useAppDispatch()
  useEffect(() => {
    dispatcher(setTT(newTT))
  }, [])
  return <></>
}
