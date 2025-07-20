"use client"
import { Button } from "@/components/ui/Buttons"
import { FaPlus } from "react-icons/fa6"
import style from "@/styles/problems/problemForms.module.css"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { Input, TitledInput } from "@/components/ui/Input"
import {useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";

export function AddProblem({ targetTTID, targetYear }: { targetTTID: number; targetYear: number }) {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const auth = useAppSelector(state => state.auth.authInfo)
  const token = useAppSelector(state => state.auth.token)
  const [isShown, setIsShown] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    const hasPermission = auth!!.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + targetTTID)
      .some((x) => x)
    setIsShown(hasPermission)
  }, [targetTTID])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handletaskCreation(e.currentTarget)
  }
  const handletaskCreation = async (form: HTMLFormElement) => {
    if (!isAuthenticated) return
    const formData = new FormData(form)
    formData.set("year", targetYear.toString())
    formData.set("tournamentType", targetTTID.toString())
    formData.set("authToken", token)
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
            <Input type="globalNumber" />
          </TitledInput>
          <TitledInput title="Title" className={style.titleInput}>
            <Input type="problemTitle" />
          </TitledInput>
        </div>
        <TitledInput title="Problem text" className={style.textInput}>
          <textarea name="problemtext"></textarea>
        </TitledInput>
        <div className={style.confirmContainer}>
          <Button type="submit" className={style.confirmationButton}>
            Создать задачу
          </Button>
          <Button
            type="button"
            className={style.editOnOtherPageButton}
            onClick={() => {
              if (!formRef.current) return
              handletaskCreation(formRef.current)
            }}
          >
            Добавить материалы
          </Button>
        </div>
      </form>
    </div>
  )
}
