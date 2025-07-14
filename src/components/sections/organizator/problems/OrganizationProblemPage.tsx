"use server"
import TestComp from "@/components/tmpComp/TestComp";
import style from "@/styles/problems/problemsList.module.css";
import ProblemFilter from "@/components/sections/problems/ProblemsFilter";
import OrganizationProblemList from "@/components/sections/organizator/problems/OrganizationProblemList";

async function OrganizationProblemPage({year}: {year: number}) {
      return (<TestComp>
      <div className="flex flex-col items-center bg-gray-100">
        <div className={style.problemsContainer}>
          <ProblemFilter year={year} />
          <OrganizationProblemList year={year}/>
        </div>
      </div>
    </TestComp>)
}

export default OrganizationProblemPage;