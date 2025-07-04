import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemcard.module.css"
import Link from "next/link"

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className={style.problemCard}>
      <div className={style.problemContainer}>
        <Link href="/underconstruction">
          <h2 className={style.problemTittle}>
            {problem.global_number}.{problem.problem_translations[0].problem_name}
          </h2>
        </Link>
        <h5 className={style.translation}>Translation here...</h5>
        <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
      </div>
      <div className={style.tournamentsContainer}>Tournaments here...</div>
    </div>
  )
}
