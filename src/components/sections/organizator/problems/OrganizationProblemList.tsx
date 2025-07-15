import {Problem, ProblemList} from "@/types/problemAPI";
import {fetchProblems} from "@/scripts/ApiFetchers";
import AuthorizedOrganizationProblemList
  from "@/components/sections/organizator/problems/AuthorizedOrganizationProblemList";

async function OrganizationProblemList({year}: { year: number }) {
  const respJSON: ProblemList | null = await fetchProblems("1", year)
  return (
    <AuthorizedOrganizationProblemList respJSON={respJSON}/>
  )
}


export default OrganizationProblemList