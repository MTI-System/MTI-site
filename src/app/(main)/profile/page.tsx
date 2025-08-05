import { User } from "@/types/authApi"
import ProfileMainPage from "@/components/sections/profile/ProfileMainPage"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import UnlockTournamentType from "@/components/Redux/UnlockTournamentType";
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
      <UnlockTournamentType/>
      <ProfileMainPage profileData={userAuth!!} />
    </>
  )
}
