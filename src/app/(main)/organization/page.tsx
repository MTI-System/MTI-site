import OrganizationMenu from "@/components/sections/organizator/OrganizationMenu";
import { User } from "@/types/authApi";
import AuthRequire from "@/components/serviceComponents/authComponents/AuthRequire";
import {AUTH_TOKEN_KEY_NAME} from "@/constants/CookieKeys";
import cookies from "js-cookie"
import {fetchPermissions} from "@/scripts/ApiFetchers";

async function MainOrganizationInterface() {
  const authToken = cookies.get(AUTH_TOKEN_KEY_NAME)
  return (
    <AuthRequire redirect={"organization"}>
      {(authInfo: User) => <OrganizationMenu profileData={authInfo} />}
    </AuthRequire>
  )
}

export default MainOrganizationInterface