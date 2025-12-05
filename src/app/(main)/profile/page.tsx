import ProfileMainPage from "@/components/profile/ProfileMainPage"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { redirect } from "next/navigation"
import UsersProviderWrapper from "@/api/users/ClientWrapper";

export const metadata: Metadata = {
  title: {
    template: "Профиль · МТИ",
    default: "Профиль · МТИ - Менеджер Турнирной Информации",
  },
  description:
    "МТИ — единое пространство для научных турниров (ТЮФ, ТЮЕ): регистрация, сетки боёв, статистика, дипломы и история достижений в одном месте.",
  verification: {
    yandex: "aa838087dd1ef992",
  },
}

export default async function ProfilePage() {
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  if (!token) {
    redirect("/login?redirect=profile")
  }
  const authStore = makeAuthStoreServer()
  const authPromise = authStore.dispatch(
    authApiServer.endpoints.fetchPermissions.initiate({
      token: token,
    }),
  )
  const { data: userAuth, error } = await authPromise
  if (error != null) {
    redirect("/login?redirect=profile")
  }

  return (
    <>
      <UsersProviderWrapper>
        <ProfileMainPage profileData={userAuth!!} />
      </UsersProviderWrapper>

    </>
  )
}
