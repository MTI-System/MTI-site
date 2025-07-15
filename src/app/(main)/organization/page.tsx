"use client"
import OrganizationMenu from "@/components/sections/organizator/OrganizationMenu";
import { User } from "@/types/authApi";
import AuthRequire from "@/components/serviceComponents/authComponents/AuthRequire";

function MainOrganizationInterface() {
  return (
    <AuthRequire redirect={"organization"}>
      {(authInfo: User) => <OrganizationMenu profileData={authInfo} />}
    </AuthRequire>
  )
}

export default MainOrganizationInterface