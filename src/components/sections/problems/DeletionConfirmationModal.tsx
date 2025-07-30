"use client"
import style from "@/styles/components/sections/problems/deletionConfirmation.module.css"
import { Dispatch, SetStateAction, useState } from "react"
import Modal from "@/components/ui/Modals"
import { IoWarningSharp } from "react-icons/io5"
import { Button, HoldButton } from "@/components/ui/Buttons"
import { PiWarningBold } from "react-icons/pi"

export default function DeletionConfirmationModal({
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
        <p>
          Вы действительно хотите удалить задачу №{problem_global_number} - {problem_tile}?
        </p>
        <div className={style.warningBlock}>
          <div className={style.warningHeader}>
            <PiWarningBold />
            <h2>Внимание!</h2>
            <PiWarningBold />
          </div>
          <p>
            При удалении задачи, сама задача и материалы, привязанные к ней, будут удалены НАВСЕГДА. Вы уверены, что вы
            хотите удалить задачу?
          </p>
        </div>
        {isError && <p className={style.errormessage}>Произошла неизвестная ошибка, повторите попытку позже</p>}
        <div className={style.buttonsContainer}>
          <Button
            onClick={() => {
              if (isLoading) return
              setIsOpen(false)
            }}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <HoldButton
            style={{ "--main-color": "var(--wsrning-accent)", "--main-light-color": "var(--alt-warning-accent)" }}
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
            {!isLoading && <>Удалить</>}
            {isLoading && <>Загрузка...</>}
          </HoldButton>
        </div>
      </div>
    </Modal>
  )
}
