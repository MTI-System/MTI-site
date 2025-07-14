"use client"
import AuthRequire from "@/components/authComponents/AuthRequire";
import {User} from "@/types/authApi";
import AddNewProblem from "@/components/sections/organizator/problems/AddNewProblem";
import {Problem, ProblemList} from "@/types/problemAPI";
import OrganizationProblemCard from "@/components/sections/organizator/problems/OrganizationProblemCard";
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner";

function AuthorizedOrganizationProblemList({respJSON}: {respJSON: ProblemList}) {
  return (<AuthRequire redirect={"organization/problems"}>
    {(userData: User) => {
      return (<>
        <AddNewProblem userData={userData}/>
        {respJSON.map((problem: Problem, index: number) => (
          <OrganizationProblemCard problem={problem} key={index + 1}></OrganizationProblemCard>
        ))}
        {respJSON.length === 0 && <FetchingErrorBanner/>}
      </>)
    }
    }
  </AuthRequire>)
}

export default AuthorizedOrganizationProblemList;