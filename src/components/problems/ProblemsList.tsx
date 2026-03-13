import ProblemCard from "@/components/problems/ProblemCard"
import { ProblemInterface, ProblemListInterface } from "@/types/problemAPI"
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner"
export default function ProblemsList({
  problems,
  isEditable,
  sectionsFilter,
  listLabel
}: {
  problems: ProblemListInterface | null | undefined
  isEditable: boolean
  sectionsFilter: number[]
  listLabel?: string
}) {
  const filteredProblems =
    problems &&
    (sectionsFilter.length === 0
      ? problems
      : problems.filter(
          (problemValue) =>
            problemValue.problem_sections.find(
              (section) => sectionsFilter.find((sec) => sec === section.id) !== undefined,
            ) !== undefined,
        ))

  return (
    <div className="flex w-full flex-col gap-4">
      {listLabel && <h2 className="text-2xl font-medium">{listLabel}</h2>}
      {filteredProblems?.map((problem: ProblemInterface, index: number) => (
        <ProblemCard problem={problem} isEditable={isEditable} key={index + 1}></ProblemCard>
      ))}
      {filteredProblems && filteredProblems.length === 0 && (
        <p className="text-text-alt border-border bg-bg-main/60 rounded-xl border px-4 py-5 text-center text-sm sm:text-base">
          Для выбранных фильтров задач не нашлось
        </p>
      )}
      {problems === null && <FetchingErrorBanner />}
    </div>
  )
}
//
