"use client"
import { FaEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemcard.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteProblem } from "@/scripts/ApiFetchers"
import { Dispatch, SetStateAction, useState, useTransition } from "react"
import Modal from "@/components/ui/Modals"
import { Button, HoldButton } from "@/components/ui/Buttons"
import { IoWarningSharp } from "react-icons/io5"
import SectionsList from "@/components/sections/problems/SectionsList"
import clsx from "clsx"

export default function ProblemCard({ problem, isEditable }: { problem: Problem; isEditable: boolean }) {
  const router = useRouter()
  const [isPendingDeletion, startTransition] = useTransition()
  const delModalState = useState(false)
  return (
    <div className={clsx(style.problemCard, { [style.cardPendingDeletion]: isPendingDeletion })}>
      <div className={style.problemContainer}>
        <div className={style.titleContainer}>
          <Link href={"/problems/" + problem.id.toString()}>
            <h2 className={style.problemTitle}>
              {problem.global_number}.{problem.problem_translations[0].problem_name}
            </h2>
          </Link>
          {isEditable && (
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
          )}
        </div>
        <h5 className={style.translation}>Translation here...</h5>
        <h3>Разделы физики:</h3>
        <SectionsList problem={problem} isModerator={isEditable} />
        <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
      </div>
      {problem.problem_translations.length > 1 && <div className={style.tournamentsContainer}>Tournaments here...</div>}
    </div>
  )
}

function DeletionConfirmationModal({
  openState,
  problem_global_number,
  problem_tile,
  onConfirm,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  problem_global_number: number
  problem_tile: string
  onConfirm: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = openState
  const [isError, setIsError] = useState(false)
  return (
    <Modal openState={openState} preventClose={isLoading}>
      <div className={style.deletionModalInfoContainer}>
        <h1>Удалить задачу?</h1>
        <IoWarningSharp className={style.warningIcon} />
        <p>
          Вы действительно хотите удалить задачу №{problem_global_number} - {problem_tile}?
        </p>
        {isError && <p className={style.errormessage}>Произошла неизвестная ошибка, повторите попытку позже</p>}
        <div className={style.buttonsContainer}>
          <HoldButton
            style={{ "--main-color": "rgb(252, 71, 71)", "--main-light-color": "rgba(255, 240, 240, 1)" }}
            onConfirm={() => {
              if (isLoading) return
              setIsLoading(true)
              setIsError(false)
              onConfirm()
                .then(() => {
                  setIsLoading(false)
                  setIsOpen(false)
                })
                .catch(() => {
                  setIsLoading(false)
                  setIsError(true)
                })
            }}
            disabled={isLoading}
          >
            {!isLoading && <>Да, удалить навсегда</>}
            {isLoading && <>Загрузка...</>}
          </HoldButton>
          <Button
            onClick={() => {
              if (isLoading) return
              setIsOpen(false)
            }}
            disabled={isLoading}
          >
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  )
}
