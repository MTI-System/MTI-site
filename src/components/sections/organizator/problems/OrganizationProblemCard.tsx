"use client"
import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemcard.module.css"
import Link from "next/link"
import { Button } from "@/components/ui/Buttons"
import cookies from "js-cookie"
import { deleteProblem } from "@/scripts/ApiFetchers"
import { useRouter } from "next/navigation"

function OrganizationProblemCard({ problem }: { problem: Problem }) {
  const router = useRouter()
  return (
    <div className={style.problemCard}>
      <div className={style.problemContainer}>
        <Link
          href={"/problems/" + problem.id.toString()}
          onNavigate={(e) => {
            console.log("Navigate", e)
          }}
        >
          <h2 className={style.problemTitle}>
            {problem.global_number}.{problem.problem_translations[0].problem_name}
          </h2>
        </Link>
        <h5 className={style.translation}>Translation here...</h5>
        <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
        <div>
          <Button
            onClick={async () => {
              await deleteProblem(problem.id, problem.tournament_type)
              router.refresh()
            }}
          >
            Удалить
          </Button>
          <Button>Редактировать</Button>
        </div>
      </div>
      <div className={style.tournamentsContainer}>Tournaments here...</div>
    </div>
  )
}

export default OrganizationProblemCard
