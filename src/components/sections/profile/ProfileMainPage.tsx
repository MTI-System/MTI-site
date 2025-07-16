"use client"
import { User } from "@/types/authApi"
import { Right } from "@/types/authApi"
import { useRouter } from "next/navigation"
import cookies from "js-cookie";


function ProfileMainPage({ profileData }: { profileData: User }) {
  const router = useRouter()
  return (
    <div>
      {!profileData && <h1>Loading ^_^</h1>}
      {profileData && <h1>{profileData?.username}</h1>}
      <h2>Ваши права:</h2>
      {profileData &&
        profileData?.rights.map((right: Right) => {
          return <p key={right.id}>{right.right_title}</p>
        })}

      <button
        onClick={() => {
          cookies.remove("mtiyt_auth_token");
          router.replace("/")
        }}
      >
        Выйти из аккаунта
      </button>
    </div>
  )
}

export default ProfileMainPage
