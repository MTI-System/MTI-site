"use client"

import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useEffect } from "react"
import cookies from "js-cookie"

export default function ThemeUpdator() {
  const theme = useAppSelector((state) => state.system.theme)

  useEffect(() => {
    cookies.set("theme", theme)
  }, [theme])
  return <></>
}
