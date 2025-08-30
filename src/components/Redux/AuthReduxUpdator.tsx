"use client"

import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useEffect } from "react"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { setAuth } from "@/redux_stores/Global/AuthSlice"

export default function AuthReduxUpdator() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  useEffect(() => {
    const getUser = async () => {
      const user = await fetchPermissions()
      dispatch(setAuth(user))
    }
    getUser()
  }, [token])

  return <></>
}
