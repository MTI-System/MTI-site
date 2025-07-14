import {Problem, ProblemList} from "@/types/problemAPI";
import fetchProblems from "@/scripts/ApiFetchers";
import OrganizationProblemCard from "@/components/sections/organizator/problems/OrganizationProblemCard";
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner";
import AddNewProblem from "@/components/sections/organizator/problems/AddNewProblem";
import {User} from "@/types/authApi";
import AuthRequire from "@/components/authComponents/AuthRequire";
import AuthorizedOrganizationProblemList
  from "@/components/sections/organizator/problems/AuthorizedOrganizationProblemList";


async function OrganizationProblemList({year}: { year: number }) {
  const respJSON: ProblemList = await fetchProblems("1", year)
  return (
    <AuthorizedOrganizationProblemList respJSON={respJSON}/>
  )
}


export default OrganizationProblemList