import {ReactNode, useEffect, useState} from "react";
import {User} from "@/types/authApi";
import {useRouter} from "next/navigation";
import {AUTH_API} from "@/constants/APIEndpoints";
import Loading from "@/app/(main)/loading";

function AuthRequire({children, redirect}: {children: any, redirect: string}) {
  const [token, setToken] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem("mti_auth_key")
    if (!savedToken) {
      router.replace("/login" + "?redirect=" + redirect)
      return
    }
    setToken(savedToken)
  }, [])

  useEffect(() => {
    if (token) {
      console.log("Token", token)
      fetch(AUTH_API + "check_auth", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.status == 401) {
            localStorage.removeItem("mti_auth_key")
            return null
          }
          return res.json()
        })
        .then((data) => {
          if (data) {
            setProfileData(data)
          } else {
            router.replace("/login" + "?redirect=" + redirect)
            return
          }
        })
    }
  }, [token])


  return (
    <>
      {!profileData && <Loading/>}
      {profileData && children(profileData)}
    </>
  )
}

export default AuthRequire