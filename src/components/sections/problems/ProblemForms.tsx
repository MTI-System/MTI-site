"use client"
import { Button } from "@/components/ui/Buttons"
import { FaPlus } from "react-icons/fa6"
import style from "@/styles/components/sections/problems/problemForms.module.css"
import { FormEvent, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { Input, TitledInput } from "@/components/ui/Input"
import { useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { useRouter } from "next/navigation"

export function AddProblem({ targetTTID, targetYear }: { targetTTID: number; targetYear: number }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth.authInfo)
  const token = useAppSelector((state) => state.auth.token)
  const [isShown, setIsShown] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)
    const isok = await handletaskCreation(e.currentTarget)
    setIsLoading(false)
    if (isok) {
      router.refresh()
    }
  }
  const handletaskCreation = async (form: HTMLFormElement) => {
    if (!isAuthenticated) return
    const formData = new FormData(form)
    formData.set("year", targetYear.toString())
    formData.set("tournamentType", targetTTID.toString())
    formData.set("firstTranslationBy", "Оффициальный перевод")
    formData.set("authToken", token)
    const resp = await fetch(PROBLEM_API + "add_problem", { method: "POST", body: formData })
    if (resp.ok) form.reset()
    return resp.ok
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
            <Input name="globalNumber" type="number" min={1} />
          </TitledInput>
          <TitledInput title="Title" className={style.titleInput}>
            <Input name="firstTranslationName" />
          </TitledInput>
        </div>
        <TitledInput title="Problem text" className={style.textInput}>
          <textarea name="firstTranslationText"></textarea>
        </TitledInput>
        <div className={style.confirmContainer}>
          <Button type="submit" className={style.confirmationButton} disabled={isLoading}>
            Создать задачу
          </Button>
          <Button
            type="button"
            className={style.editOnOtherPageButton}
            disabled={isLoading}
            onClick={async () => {
              if (!formRef.current) return
              setIsLoading(true)
              const isok = await handletaskCreation(formRef.current)
              setIsLoading(false)
              if (isok) router.push("/underconstruction")
            }}
          >
            Добавить материалы
          </Button>
        </div>
      </form>
    </div>
  )
}
