"use client"
import { AUTH_API } from "@/constants/APIEndpoints"
import { AUTH_TOKEN_KEY_NAME } from "@/constants/CookieKeys"
import { User, UserSchema } from "@/types/authApi"
import cookies from "js-cookie"
import { createContext, useEffect, useState } from "react"

interface AuthData extends User {
  token: string
  logout: () => void
}

export const AuthContext = createContext<AuthData | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null)
  useEffect(() => {
    const token = cookies.get(AUTH_TOKEN_KEY_NAME)
    const abort = new AbortController()
    fetch(AUTH_API + "check_auth", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      signal: abort.signal,
    }).then((response) => {
      if (!response.ok) return
      response.json().then((json) => {
        const parsedJSON = UserSchema.safeParse(json)
        if (!parsedJSON.success) return
        setAuth({ token: token!!, logout: () => setAuth(null), ...parsedJSON.data })
      })
    })
    return () => {
      abort.abort()
    }
  }, [])
  return <AuthContext value={auth}>{children}</AuthContext>
}
