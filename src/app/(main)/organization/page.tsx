"use client"
import AuthRequire from "@/components/authComponents/AuthRequire";
import OrganizationMenu from "@/components/sections/organizator/OrganizationMenu";
import { User } from "@/types/authApi";

function MainOrganizationInterface() {
    return (
      <AuthRequire redirect={"organization"}>
          {(authInfo: User) => <OrganizationMenu profileData={authInfo}/> }
      </AuthRequire>
        )
}

export default MainOrganizationInterface