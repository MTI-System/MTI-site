"use client"

import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useEffect } from "react"
import { setAuth } from "@/redux_stores/Global/AuthSlice"
import { useFetchPermissionsMutation } from "@/api/auth/clientApiInterface"

export default function AuthReduxUpdator() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const [fetchPermissions, { data, error, isLoading, isSuccess }] = useFetchPermissionsMutation()

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuth(data))
    }
  }, [isSuccess])

  useEffect(() => {
    fetchPermissions({ token: token })
  }, [token])

  return <></>
}
