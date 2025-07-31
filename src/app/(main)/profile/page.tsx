import { User } from "@/types/authApi"
import ProfileMainPage from "@/components/sections/profile/ProfileMainPage"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import UnlockTournamentType from "@/components/Redux/UnlockTournamentType";

export default async function ProfilePage() {
  const userAuth = await fetchPermissions("profile")
  return (
    <>
      <UnlockTournamentType/>
      <ProfileMainPage profileData={userAuth!!} />
    </>
  )
}
