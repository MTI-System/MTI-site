import AddNewProblem from "@/components/sections/organizator/problems/AddNewProblem";
import {Problem, ProblemList} from "@/types/problemAPI";
import OrganizationProblemCard from "@/components/sections/organizator/problems/OrganizationProblemCard";
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner";
import {fetchPermissions} from "@/scripts/ApiFetchers";

async function AuthorizedOrganizationProblemList({respJSON}: {respJSON: ProblemList}) {
  const userAuth = await fetchPermissions(true, "organization")
  return (
    <>
        <AddNewProblem userData={userAuth!!}/>
        {respJSON.map((problem: Problem, index: number) => (
          <OrganizationProblemCard problem={problem} key={index + 1}></OrganizationProblemCard>
        ))}
        {respJSON.length === 0 && <FetchingErrorBanner/>}
      </>


    )
}

export default AuthorizedOrganizationProblemList;