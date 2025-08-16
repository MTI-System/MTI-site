import { User } from "@/types/authApi"
import ProfileMainPage from "@/components/profile/ProfileMainPage"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "Профиль · МТИ",
    default: "Профиль · МТИ - Менеджер Турнирной Информации",
  },
  description: "МТИ — единое пространство для научных турниров (ТЮФ, ТЮЕ): регистрация, сетки боёв, статистика, дипломы и история достижений в одном месте.",
  verification: {
    yandex: "aa838087dd1ef992",
  },
}

export default async function ProfilePage() {
  const userAuth = await fetchPermissions("profile")
  return (
    <>
      <ProfileMainPage profileData={userAuth!!} />
    </>
  )
}
