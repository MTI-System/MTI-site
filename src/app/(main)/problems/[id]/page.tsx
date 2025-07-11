import { PROBLEM_API } from "@/constants/APIEndpoints"
import ProblemPage from "@/components/sections/problems/ProblemPage"
import { Problem } from "@/types/problemAPI"
import NotFound from "@/components/sections/problems/NotFound"
import style from "@/styles/problems/problemPage.module.css"

async function ProblemPageMain({ params }: PageProps) {
  const { id } = await params
  const problemRequest = await fetch(PROBLEM_API + "get_problem_by_global_id/" + id.toString())
  if (problemRequest.status === 404) return <NotFound />
  const problem: Problem = await problemRequest.json()
  if (problem === null) return <NotFound />
  return (
    <div className={style.pageRoot}>
      <div className={style.problemContainer}>
        <div className={style.problemWithGif}>
          <div className={style.problemWithTournamets}>
            <div className={style.problemCard}>
              <h2 className={style.problemTitle}>
                {problem.global_number}.{problem.problem_translations[0].problem_name}
              </h2>
              <h5 className={style.translation}>Translation here...</h5>
              <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
            </div>
            <div className={style.tournamentsContainer}>Tournaments here...</div>
          </div>
          <div className={style.gifContainer}>Optional GIF here...</div>
        </div>
        <div className={style.primaryVideoContainer}>
          <div className={style.tmpVideo}>Video here...</div>
        </div>
        <div className={style.filesContainer}>Materials here...</div>
      </div>
    </div>
  )
}

export default ProblemPageMain
