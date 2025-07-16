import OrganizationMenu from "@/components/sections/organizator/OrganizationMenu";
import {AUTH_TOKEN_KEY_NAME} from "@/constants/CookieKeys";
import cookies from "js-cookie"
import {fetchPermissions} from "@/scripts/ApiFetchers";

async function MainOrganizationInterface() {
  const userAuth = await fetchPermissions(true, "organization")
  return (
    <OrganizationMenu profileData={userAuth!!} />
  )
}

export default MainOrganizationInterface