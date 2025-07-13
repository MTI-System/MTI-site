"use client"
import ClickableCard from "@/components/ui/ClickableCard"
import { useEffect, useState } from "react"
import AuthRequire from "@/components/serviceComponents/authComponents/AuthRequire"
import OrganizationMenu from "@/components/sections/organizator/OrganizationMenu"
import { User } from "@/types/authApi"

function MainOrganizationInterface() {
  return (
    <AuthRequire redirect={"organization"}>
      {(authInfo: User) => <OrganizationMenu profileData={authInfo} />}
    </AuthRequire>
  )
}

export default MainOrganizationInterface
