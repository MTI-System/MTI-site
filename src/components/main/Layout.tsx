"use client"
import cookies from "js-cookie"
import { TOURNAMENT_TYPE_KEY_NAME } from "@/constants/CookieKeys"
import { setTT } from "@/redux_stores/Global/SearchParamsSlice"
import { useEffect, useRef, useState, useTransition } from "react"
import { setAuth, setToken } from "@/redux_stores/Global/AuthSlice"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { User } from "@/types/authApi"
import { setIsPending } from "@/redux_stores/Global/SystemSlice"
import { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function LayoutComponent({ children }: { children: ReactNode }) {
  const theme = useAppSelector((state) => state.system.theme)
  return (
    <>
      <body className="h-[100vh]" data-theme={theme}>
        <InitRedux />
        {children}
      </body>
    </>
  )
}

function InitRedux() {
  const dispatch = useAppDispatch()
  const [auth, setAuthState] = useState<User | null>(null)
  const [isPending, startTransition] = useTransition()
  const mounted = useRef(false)
  useEffect(() => {
    const tt = cookies.get(TOURNAMENT_TYPE_KEY_NAME)
    const token = cookies.get("mtiyt_auth_token")
    const getAuth = async () => {
      const user = await fetchPermissions()
      console.log("UserId", "init", user)
      setAuthState(user)
    }

    if (tt) {
      dispatch(setTT(Number(tt)))
    }
    if (token) {
      dispatch(setToken(token))
    }
    getAuth()
  }, [dispatch])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    dispatch(setIsPending(isPending))
  }, [isPending, dispatch])

  useEffect(() => {
    dispatch(setIsPending(false))
  }, [])

  useEffect(() => {
    if (auth) {
      dispatch(setAuth(auth))
    }
  }, [auth])

  return <></>
}
