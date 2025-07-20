import { User } from "@/types/authApi"
import ProfileMainPage from "@/components/sections/profile/ProfileMainPage"
import { fetchPermissions } from "@/scripts/ApiFetchers"

export default async function ProfilePage() {
  const userAuth = await fetchPermissions("profile")
  return (
    <>
      <ProfileMainPage profileData={userAuth!!} />
    </>
  )
}
