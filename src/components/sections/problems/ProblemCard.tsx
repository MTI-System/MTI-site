"use client"
import { FaEdit, FaPlus } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { ProblemInterface, ProblemSectionInterface } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemCard.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteProblem, fetchAddSectionToTask } from "@/scripts/ApiFetchers"
import { CSSProperties, useMemo, useState, useTransition } from "react"
import clsx from "clsx"
import { PiGlobeLight } from "react-icons/pi"
import ProblemSection from "@/components/sections/problems/ProblemSection"
import DeletionConfirmationModal from "./DeletionConfirmationModal"
import { Dropdown } from "@/components/ui/Dropdown"

export default function ProblemCard({ problem, isEditable }: { problem: ProblemInterface; isEditable: boolean }) {
  const [isPendingDeletion, startTransition] = useTransition()
  return (
    <div className={clsx(style.problemCard, { [style.cardPendingDeletion]: isPendingDeletion })}>
      <ProblemCardContent problem={problem} isEditable={isEditable} startTransition={startTransition} />
    </div>
  )
}

export function ProblemCardContent({
  problem,
  isEditable,
  startTransition,
}: {
  problem: ProblemInterface
  isEditable: boolean
  startTransition?: (trh: () => void) => void
}) {
  const [selectedTrnslation, setTrnslation] = useState(0)
  return (
    <>
      <div className={style.cardHeader}>
        <div className={style.titleContainer}>
          <Link href={"/problems/" + problem.id.toString()}>
            <h2 className={style.problemTitle}>
              {problem.global_number}.{problem.problem_translations[selectedTrnslation].problem_name}
            </h2>
          </Link>
          {startTransition && isEditable && <EditButtons startTransition={startTransition} problem={problem} />}
        </div>
        <div className={style.translationContainer}>
          <PiGlobeLight />
          <div className={style.translationSelector}>
            <h2 className={style.translationName}>{problem.problem_translations[selectedTrnslation].problem_by}</h2>
          </div>
        </div>
      </div>
      <div className={style.textContainer}>
        <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
      </div>
      <div className={style.sectionListContainer}>
        <h3>Разделы физики:</h3>
        <SectionsList problem={problem} isEditable={isEditable} />
      </div>
    </>
  )
}

function EditButtons({
  startTransition,
  problem,
}: {
  startTransition: (transitionHandler: () => void) => void
  problem: ProblemInterface
}) {
  const router = useRouter()
  const isDelModalOpenState = useState(false)
  const setIsDelModalOpen = isDelModalOpenState[1]

  return (
    <>
      <div className={style.editButtons}>
        <Link href={"/underconstruction"}>
          <FaEdit />
        </Link>
        <MdDeleteOutline
          onClick={() => {
            console.log(problem)
            setIsDelModalOpen(true)
          }}
        />
      </div>
      <DeletionConfirmationModal
        problem_global_number={problem.global_number}
        problem_title={problem.problem_translations[0].problem_name}
        openState={isDelModalOpenState}
        onConfirm={async () => {
          console.log(problem)
          const s = await deleteProblem(problem.id, problem.tournament_type)
          if (!s) throw new Error("Deletion has failed")
          console.log("Delete fetch completed")
          startTransition(() => {
            router.refresh()
          })
        }}
      />
    </>
  )
}

function SectionsList({ problem, isEditable }: { problem: ProblemInterface; isEditable: boolean }) {
  return (
    <div className={style.sectionsList}>
      {problem.problem_sections.map((section) => {
        return <ProblemSection key={section.id} section={section} isEditable={isEditable} />
      })}
      {problem.problem_sections.length == 0 && (
        <ProblemSection section={{ id: 0, title: "Не определено", icon_src: "forbidden.svg", tile_color: "#AAAAAA" }} />
      )}
      {isEditable && <AddNewSection problemId={problem.id} existingSections={problem.problem_sections} />}
    </div>
  )
}

// function AddNewSection({ problemId }: { problemId: number }) {
//   const isAddNewModalOpenStste = useState(false)
//   const setIsAddNewModalOpen = isAddNewModalOpenStste[1]
//   return (
//     <>
//       <Button onClick={() => setIsAddNewModalOpen(true)}>Добавить</Button>
//       <AddNewSectionModal openState={isAddNewModalOpenStste} problemId={problemId} />
//     </>
//   )
// }

function AddNewSection({
  problemId,
  existingSections,
}: {
  problemId: number
  existingSections: ProblemSectionInterface[]
}) {
  const defaultColors = {
    "--border-color": "var(--primary-accent)",
    "--bg-color": "var(--alt-primary-accent)",
    opacity: 1,
  }
  const [color, setColor] = useState(defaultColors)
  const [isError, setIsError] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const defaultElement = useMemo(() => {
    if (isError) {
      setColor((curColor) => {
        const newColor = { ...curColor }
        newColor["--border-color"] = "var(--warning-accent)"
        newColor["--bg-color"] = "rgba(from var(--border-color) r g b / 0.125)"
        newColor.opacity = 1
        return newColor
      })
      setTimeout(() => {
        setIsError(false)
      }, 2000)
    } else setColor(defaultColors)
    return {
      displayElement: (
        <div className={style.defaultOption}>
          <FaPlus />
          {isError ? <p>Ошибка</p> : <p>Добавить</p>}
        </div>
      ),
      value: "0",
      active: true,
    }
  }, [existingSections, isError])
  const addableSections = useMemo(() => {
    // Make fetching and filtering logic here...
    const trueExistingSections = [
      { id: 1, title: "Механика", icon_src: "glass.svg", tile_color: "#32E875" },
      { id: 2, title: "Оптика", icon_src: "glass.svg", tile_color: "#1E2EDE" },
      { id: 3, title: "Термодинамика", icon_src: "glass.svg", tile_color: "#DE841E" },
      { id: 4, title: "Магнетизм", icon_src: "glass.svg", tile_color: "#DA3633" },
    ]
    return trueExistingSections
  }, [existingSections])

  return (
    <>
      <Dropdown
        options={addableSections.map((section) => {
          return {
            displayElement: (
              <div className={style.addSectionOptionContainer}>
                <ProblemSection key={section.id} section={section} />
              </div>
            ),
            value: section.id.toString(),
            active: true,
          }
        })}
        defaultSelection={defaultElement}
        onOptionSelect={async (sel) => {
          const color = addableSections.find((val) => val.id.toString() === sel)?.tile_color
          setColor((curColor) => {
            const newColor = { ...curColor }
            newColor["--border-color"] = color ?? "var(--primary-accent)"
            newColor["--bg-color"] = "rgba(from var(--border-color) r g b / 0.125)"
            newColor.opacity = 0.5
            return newColor
          })
          const res = await fetchAddSectionToTask(problemId.toString(), sel)
          if (res) {
            startTransition(() => {
              router.refresh()
            })
            return
          }
          setIsError(true)
        }}
        className={style.addNewSectionDropdown}
        style={color as CSSProperties}
        disabled={isPending || isError}
      />
    </>
  )
}
