"use client"
import { useEffect, useState } from "react"
import { AUTH_API } from "@/components/constants"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem("mti_auth_key")
    console.log(savedToken)
    if (!savedToken) {
      router.push("/login")
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
            router.push("/login")
            return
          }
        })
    }
  }, [token])

  return (
    <div>
      {!profileData && <h1>Loading ^_^</h1>}
      {profileData && <h1>{profileData?.username}</h1>}
      <h2>Ваши права:</h2>
      {profileData && profileData?.rights.map(
        (right: Right)=>{
          return (<p key={right.id}>{right.right_title}</p>)
        }
      )}

      <button onClick={
        () => {
          localStorage.removeItem("mti_auth_key")
          router.push("/login")
        }
      }>Выйти из аккаунта</button>
    </div>
  )
}
