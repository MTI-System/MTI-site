"use client"
import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemcard.module.css"
import Link from "next/link"

export default function ProblemCard({ problem }: { problem: Problem }) {
    // const cookieStore = await cookies()
    return (
      <div className={style.problemCard}>
        <div className={style.problemContainer}>
          <Link href={"/problems/" + problem.id.toString()}
          onNavigate={
              (e)=>{
                console.log("Navigate", e)
                // cookieStore.set('current_task', 'lee')
              }
          }
          >
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
