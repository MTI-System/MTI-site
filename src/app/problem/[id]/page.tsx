import {PROBLEM_API} from "@/components/constants";
import {json} from "node:stream/consumers";
import {collectSegmentData} from "next/dist/server/app-render/collect-segment-data";
import ProblemPage from "@/components/sections/problems/ProblemPage";
import {Problem} from "@/types/problemAPI";
import NotFound from "@/components/sections/problems/NotFound";


async function ProblemPageMain({ params }: PageProps ){
    const {id} = await params;
    const problem: Problem = await fetch(PROBLEM_API + "get_problem_by_global_id/" + id.toString()).then(
      (res) => {
        if (res.status == 404){
          return null
        }
        return res.json()
      }
    ).then(data => {
      return data
    })
    if (problem === null){
      return <NotFound/>
    }
    return (<div>
              <ProblemPage problem={problem}/>
            </div>)
}

export default ProblemPageMain;