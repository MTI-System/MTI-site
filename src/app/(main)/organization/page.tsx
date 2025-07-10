"use client"
import ClickableCard from "@/components/ui/ClickableCard"
import {useEffect, useState} from "react";
import AuthRequire from "@/components/authComponents/AuthRequire";
import Menu from "@/components/sections/organizator/Menu";
import { User } from "@/types/authApi";

function MainOrganizationInterface() {
    return (
      <AuthRequire redirect={"organization"}>
          {(authInfo: User) => <Menu profileData={authInfo}/> }
      </AuthRequire>
        )
}

export default MainOrganizationInterface