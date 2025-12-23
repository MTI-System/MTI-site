"use client"
import cookies from "js-cookie"
import {TOURNAMENT_TYPE_KEY_NAME} from "@/constants/CookieKeys"
import {setTT} from "@/redux_stores/Global/SearchParamsSlice"
import {useEffect, useRef, useState, useTransition} from "react"
import {setAuth, setToken} from "@/redux_stores/Global/AuthSlice"
import {User} from "@/types/authApi"
import {setIsPending} from "@/redux_stores/Global/SystemSlice"
import {ReactNode} from "react"
import {useAppDispatch, useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore"
import {useFetchPermissionsMutation} from "@/api/auth/clientApiInterface"
import AuthProviderWrapper from "@/api/auth/ClientWrapper"
import {Snowfall} from "react-snowfall";

export default function LayoutComponent({children}: { children: ReactNode }) {
  const theme = useAppSelector((state) => state.system.theme)
  return (
    <>
      <body className="h-screen" data-theme={theme}>
      <Snowfall
        // Changes the snowflake color
        color="#fffafa"
        // Applied to the canvas element
        style={{position: "fixed", zIndex:10}}
        // Controls the number of snowflakes that are created (default 150)
        snowflakeCount={100}
        speed={[0.5,1]}
        wind={[0.5,5]}
      />

        <AuthProviderWrapper>
          <InitRedux/>
        </AuthProviderWrapper>

        {children}

      </body>
    </>
  )
}

function InitRedux() {
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  const mounted = useRef(false)
  const [fetchPermissions, {data: auth, error, isLoading, isSuccess}] = useFetchPermissionsMutation()

  useEffect(() => {
    const tt = cookies.get(TOURNAMENT_TYPE_KEY_NAME) ?? "1"
    const token = cookies.get("mtiyt_auth_token") ?? ""
    fetchPermissions({token: token})
    if (tt) {
      dispatch(setTT(Number(tt)))
    }
    if (token) {
      dispatch(setToken(token))
    }
    // getAuth()
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
