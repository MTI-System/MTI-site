"use client"
import { Button } from "@/components/ui/Buttons"
import { FaPlus } from "react-icons/fa6"
import style from "@/styles/problems/problemForms.module.css"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { Input, TitledInput } from "@/components/ui/Input"
import { AuthContext } from "@/context/app/AuthContext"
import { PROBLEM_API } from "@/constants/APIEndpoints"

export function AddProblem({ targetTTID, targetYear }: { targetTTID: number; targetYear: number }) {
  const authObject = useContext(AuthContext)
  const [isShown, setIsShown] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!authObject) return
    const hasPermission = authObject.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + targetTTID)
      .some((x) => x)
    setIsShown(hasPermission)
  }, [targetTTID])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handletaskCreation(e.currentTarget)
  }
  const handletaskCreation = async (form: HTMLFormElement) => {
    if (!authObject) return
    const formData = new FormData(form)
    formData.set("year", targetYear.toString())
    formData.set("tournamentType", targetTTID.toString())
    // formData.set("firstTranslationName", newProblemData!!.firstTranslationName)
    // formData.set("firstTranslationText", newProblemData!!.firstTranslationText)
    // formData.set("firstTranslationBy", newProblemData!!.firstTranslationBy)
    formData.set("authToken", authObject.token)
    // TODO: implement form sending logic

    // fetch(PROBLEM_API + "add_problem", { method: "POST", body: formData }).then((res) => {
    //   setStatusCode(res.status)
    // })
    // if (statusCode != 200) {
    //   console.log("ERRORRRR!!!!")
    // } else {
    //   router.refresh()
    //   console.log("ALL OK")
    // }
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
