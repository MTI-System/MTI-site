"use client"
import { FaEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemcard.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteProblem } from "@/scripts/ApiFetchers"
import { useTransition } from "react"

export default function ProblemCard({ problem, isEdiatable }: { problem: Problem; isEdiatable: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <div className={style.problemCard}>
      <div className={style.problemContainer}>
        <div className={style.titleContainer}>
          <Link href={"/problems/" + problem.id.toString()}>
            <h2 className={style.problemTitle}>
              {problem.global_number}.{problem.problem_translations[0].problem_name}
            </h2>
          </Link>
          {isEdiatable && (
            <div className={style.editButtons}>
              <Link href={"/underconstruction"}>
                <FaEdit />
              </Link>
              <MdDeleteOutline
                onClick={async () => {
                  await deleteProblem(problem.id, problem.tournament_type)
                  startTransition(() => {
                    router.refresh()
                  })
                }}
              />
            </div>
          )}
        </div>
        <h5 className={style.translation}>Translation here...</h5>
        <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
      </div>
      {problem.problem_translations.length > 1 && <div className={style.tournamentsContainer}>Tournaments here...</div>}
    </div>
  )
}
