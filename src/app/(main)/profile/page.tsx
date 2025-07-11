"use client"
import { useEffect, useState } from "react"
import { AUTH_API } from "@/constants/APIEndpoints"
import { useRouter } from "next/navigation"
import {User} from "@/types/authApi";
import AuthRequire from "@/components/authComponents/AuthRequire";
import ProfileMainPage from "@/components/sections/profile/ProfileMainPage";

export default function ProfilePage() {
  return (
    <>
      <AuthRequire redirect={"profile"}>
        {(profileData: User)=><ProfileMainPage profileData={profileData}/>}
      </AuthRequire>
    </>
  )
}