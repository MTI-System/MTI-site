"use client"
import style from "@/styles/routes/(main)/profile/profilePage.module.css"
import { User } from "@/types/authApi"
import { Right } from "@/types/authApi"
import { useRouter } from "next/navigation"
import cookies from "js-cookie"
import { useAppDispatch } from "@/redux_stores/tournamentTypeRedixStore"
import { setAuth } from "@/redux_stores/AuthSlice"
import { HoldButton } from "@/components/ui/Buttons"
import { useTransition } from "react"

export default function ProfileMainPage({ profileData }: { profileData: User }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className={style.profilePage}>
      <div className={style.profileContainer}>
        <h1>Добро пожаловать, {profileData?.username}!</h1>
        <div className={style.rights}>
          <h2 className={style.rightsTitle}>Ваши права:</h2>
          <div className={style.rightsContainer}>
            {profileData &&
              profileData?.rights.map((right: Right) => {
                return (
                  <p className={style.right} key={right.id}>
                    {right.right_title}
                  </p>
                )
              })}
          </div>
        </div>
        <HoldButton
          className={style.logout}
          style={{ "--main-color": "var(--warning-accent)", "--main-light-color": "var(--alt-warning-accent)" }}
          onConfirm={() => {
            startTransition(() => {
              cookies.remove("mtiyt_auth_token")
              dispatch(setAuth(null))
              router.replace("/")
            })
          }}
          disabled={isPending}
        >
          Выйти из аккаунта
        </HoldButton>
      </div>
    </div>
  )
}
