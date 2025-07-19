"use client"
import BlueButton from "@/components/Default/BlueButton"
import { FaPlus } from "react-icons/fa6"
import style from "@/styles/problems/problemForms.module.css"
import { FormEvent, useRef, useState } from "react"
import clsx from "clsx"
import { Input, TitledInput } from "@/components/ui/Input"

export function AddProblem({ isShown }: { isShown: boolean; targetTTID: number; targetYear: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handletaskCreation(e.currentTarget)
  }
  const handletaskCreation = async (form: HTMLFormElement) => {
    const formdata = new FormData(form)
    // TODO: Add logic for task submission
  }

  return (
    <div
      className={clsx(style.addButton, { [style.hiddenButton]: !isShown, [style.expandedButton]: isExpanded })}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true)
      }}
    >
      <div className={style.plusContaner}>
        <FaPlus
          onClick={() => {
            if (isExpanded) setIsExpanded(false)
          }}
        />
      </div>
      <form className={style.newProblemform} ref={formRef} onSubmit={handleSubmit}>
        <div className={style.numberAndTitleContainer}>
          <TitledInput title="№" className={style.numberInput}>
            <Input type="problemNo" />
          </TitledInput>
          <TitledInput title="Title" className={style.titleInput}>
            <Input type="problemTitle" />
          </TitledInput>
        </div>
        <TitledInput title="Problem text" className={style.textInput}>
          <textarea name="problemtext"></textarea>
        </TitledInput>
        <div className={style.confirmContainer}>
          <BlueButton type="submit" className={style.confirmationButton}>
            Создать задачу
          </BlueButton>
          <BlueButton
            type="button"
            className={style.editOnOtherPageButton}
            onClick={() => {
              if (!formRef.current) return
              handletaskCreation(formRef.current)
            }}
          >
            Добавить материалы
          </BlueButton>
        </div>
      </form>
    </div>
  )
}
