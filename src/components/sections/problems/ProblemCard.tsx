"use client"
import { FaEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { Problem } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemCard.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteProblem } from "@/scripts/ApiFetchers"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/Buttons"
import clsx from "clsx"
import { PiGlobeLight } from "react-icons/pi"
import ProblemSectionComponent from "@/components/sections/problems/ProblemSection"
import ModalDialog from "@/components/Dialogs/ModalDialog"
import NewProblemForm from "@/components/Dialogs/Forms/NewProblemForm"
import DeletionConfirmationModal from "./DeletionConfirmationModal"

// export default function ProblemCard({ problem, isEditable }: { problem: Problem; isEditable: boolean }) {
//   const [isPendingDeletion, startTransition] = useTransition()
//   return (
//     <div className={clsx(style.problemCard, { [style.cardPendingDeletion]: isPendingDeletion })}>
//       <div className={style.problemContainer}>
//         <div className={style.titleContainer}>
//           <Link href={"/problems/" + problem.id.toString()}>
//             <h2 className={style.problemTitle}>
//               {problem.global_number}.{problem.problem_translations[0].problem_name}
//             </h2>
//           </Link>
//           {isEditable && <EditButtons startTransition={startTransition} problem={problem} />}
//         </div>
//         <h5 className={style.translation}>Translation here...</h5>
//         <h3>Разделы физики:</h3>
//         <SectionsList problem={problem} isModerator={isEditable} />
//         <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
//       </div>
//       {problem.problem_translations.length > 1 && <div className={style.tournamentsContainer}>Tournaments here...</div>}
//     </div>
//   )
// }

export default function ProblemCard({ problem, isEditable }: { problem: Problem; isEditable: boolean }) {
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
  problem: Problem
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
        <SectionsList problem={problem} isModerator={isEditable} />
      </div>
    </>
  )
}

function EditButtons({
  startTransition,
  problem,
}: {
  startTransition: (transitionHandler: () => void) => void
  problem: Problem
}) {
  const router = useRouter()
  const delModalState = useState(false)
  return (
    <>
      <div className={style.editButtons}>
        <Link href={"/underconstruction"}>
          <FaEdit />
        </Link>
        <MdDeleteOutline
          onClick={() => {
            delModalState[1](true)
          }}
        />
      </div>
      <DeletionConfirmationModal
        problem_global_number={problem.global_number}
        problem_tile={problem.problem_translations[0].problem_name}
        openState={delModalState}
        onConfirm={async () => {
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

function SectionsList({ problem, isModerator }: { problem: Problem; isModerator: boolean }) {
  const [modalDialogState, setDialogState] = useState(0)
  return (
    <div className={style.sectionsList}>
      {problem.problem_sections.map((section) => {
        return <ProblemSectionComponent key={section.id} section={section} />
      })}
      {problem.problem_sections.length == 0 && (
        <ProblemSectionComponent
          section={{ id: 0, title: "Не определено", icon_src: "forbidden.svg", tile_color: "#AAAAAA" }}
        />
      )}
      {isModerator && <Button onClick={() => setDialogState(1)}>Добавить</Button>}

      <ModalDialog isOpen={modalDialogState == 1} onClose={() => {}}>
        <NewProblemForm setModalState={setDialogState} problemId={problem.id} />
      </ModalDialog>
    </div>
  )
}
