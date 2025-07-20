import {Problem, ProblemList} from "@/types/problemAPI";
import {fetchProblems} from "@/scripts/ApiFetchers";
import AuthorizedOrganizationProblemList
  from "@/components/sections/organizator/problems/AuthorizedOrganizationProblemList";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";

async function OrganizationProblemList({tt, year}: { tt: string, year: number }) {
  const respJSON: ProblemList|null = await fetchProblems((availableTournamentTypes.find(value => value.name === tt)?.id!!).toString(), year)
  return (
    <AuthorizedOrganizationProblemList respJSON={respJSON!!}/>
  )
}


export default OrganizationProblemList