import ProblemsList from "@/components/sections/problems/ProblemsList"
import style from "@/styles/problems/problemsList.module.css"
import ProblemFilter from "@/components/sections/problems/ProblemsFilter"
import { Suspense } from "react"

async function ProblemsPage({ searchParams }: { searchParams: Promise<{ year: number }> }) {
  const year = (await searchParams).year ?? 2026
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <ProblemFilter year={year} />
        <Suspense key={year} fallback={<h1>Loading...O_O</h1>}>
          <ProblemsList year={year} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProblemsPage
