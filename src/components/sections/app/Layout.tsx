"use client"
import cookies from "js-cookie"
import { TOURNAMENT_TYPE_KEY_NAME } from "@/constants/CookieKeys"
import { setTT } from "@/redux_stores/SearchParamsSlice"
import { useEffect, useRef, useState, useTransition } from "react"
import { setAuth, setToken } from "@/redux_stores/AuthSlice"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { User } from "@/types/authApi"
import { setIsPending } from "@/redux_stores/SystemSlice"
import { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"

export default function LayoutComponent({ children }: { children: ReactNode }) {
  const theme = useAppSelector((state) => state.system.theme)
  return (
    <>
      <body data-theme={theme}>
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
    // console.log("INIT STATE", )
    console.log("INIT REDUX FROM COOKIES")
    const tt = cookies.get(TOURNAMENT_TYPE_KEY_NAME)
    const token = cookies.get("mtiyt_auth_token")
    const getAuth = async () => {
      const user = await fetchPermissions()
      setAuthState(user)
    }

    if (tt) {
      dispatch(setTT(tt))
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
    console.log("auth", auth)
    if (auth) {
      dispatch(setAuth(auth))
    }
  }, [auth])

  return <></>
}
