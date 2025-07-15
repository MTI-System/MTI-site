import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage.module.css"

async function ProblemPage({ problem }: { problem: Problem }) {
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

export default ProblemPage
