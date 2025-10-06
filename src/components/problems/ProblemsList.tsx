"use server"
import ProblemCard from "@/components/problems/ProblemCard"
import { ProblemInterface, ProblemListInterface } from "@/types/problemAPI"
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner"
export default async function ProblemsList({
  problems,
  isEditable,
  sectionsFilter,
}: {
  problems: ProblemListInterface | null
  isEditable: boolean
  sectionsFilter: number[]
}) {
  return (
    <div className="flex flex-col gap-2">
      {problems !== null &&
        (sectionsFilter.length === 0
          ? problems
          : problems.filter(
              (problemValue) =>
                problemValue.problem_sections.find(
                  (section) => sectionsFilter.find((sec) => sec === section.id) !== undefined,
                ) !== undefined,
            )
        ).map((problem: ProblemInterface, index: number) => (
          <ProblemCard problem={problem} isEditable={isEditable} key={index + 1}></ProblemCard>
        ))}
      {problems === null && <FetchingErrorBanner />}
    </div>
  )
}
//
