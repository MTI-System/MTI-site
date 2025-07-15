"use client"
import {User} from "@/types/authApi";
import ProfileMainPage from "@/components/sections/profile/ProfileMainPage";
import AuthRequire from "@/components/serviceComponents/authComponents/AuthRequire";

export default function ProfilePage() {
  return (
    <>
      <AuthRequire redirect={"profile"}>
        {(profileData: User)=><ProfileMainPage profileData={profileData}/>}
      </AuthRequire>
    </>
  )
}
