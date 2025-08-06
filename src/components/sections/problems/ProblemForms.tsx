"use client"
import { Button } from "@/components/ui/Buttons"
import { FaPlus } from "react-icons/fa6"
import style from "@/styles/components/sections/problems/problemForms.module.css"
import { FormEvent, useEffect, useRef, useState, useTransition } from "react"
import clsx from "clsx"
import { Input, TitledInput } from "@/components/ui/Input"
import { useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { useRouter } from "next/navigation"

export function AddProblem({ targetTTID, targetYear }: { targetTTID: number; targetYear: number }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const auth = useAppSelector((state) => state.auth.authInfo)
  const token = useAppSelector((state) => state.auth.token)
  const [isShown, setIsShown] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState("")

  useEffect(()=>{
    console.log("error: ", error)
  }, [error])

  useEffect(() => {
    if (!isAuthenticated) return
    if (auth == null) return
    const hasPermission = auth!!.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + targetTTID)
      .some((x) => x)
    setIsShown(hasPermission)
  }, [targetTTID])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError("")
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    if(!formData.get("globalNumber") || !formData.get("firstTranslationName") || !formData.get("firstTranslationText") || !formData.get("firstTranslationBy")){
      setError("Все поля должны быть заполнены")
      setIsLoading(false)
      return
    }
    const isok = await handletaskCreation(e.currentTarget)
    if (isok) {
      startTransition(() => {
        setIsLoading(false)
        router.refresh()
      })
      return
    }
    else{
      setError("При добавлении задачи произошла ошибка")
    }
    setIsLoading(false)
  }

  const handletaskCreation = async (form: HTMLFormElement) => {
    if (!isAuthenticated) return
    const formData = new FormData(form)
    formData.set("year", targetYear.toString())
    formData.set("tournamentType", targetTTID.toString())
    formData.set("authToken", token)
    const resp = await fetch(PROBLEM_API + "add_problem", { method: "POST", body: formData })
    if (resp) form.reset()
    if (resp.status != 200){
      return null
    }
    // console.log("RESPONSE", await resp.text())
    return await resp.text()
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
          <TitledInput title="Название" className={style.titleInput}>
            <Input name="firstTranslationName" />
          </TitledInput>
        </div>
        <TitledInput title="Условие задания" className={style.textInput}>
          <textarea name="firstTranslationText"></textarea>
        </TitledInput>
        <TitledInput title="Перевод" className={style.problemByInput}>
          <Input className={style.problemByInputField} name="firstTranslationBy" defaultValue={"Официальный перевод"} />
        </TitledInput>
        {error!="" && <p className={style.errorMessage}>{error}</p>}
        <div className={style.confirmContainer}>
          <Button type="submit" className={style.editOnOtherPageButton} disabled={isLoading || isPending}>
            Создать задачу
          </Button>
          <Button
            type="button"
            className={style.editOnOtherPageButton}
            disabled={isLoading || isPending}
            onClick={async () => {
              setError("")
              if (!formRef.current) return
              setIsLoading(true)
              const isok = await handletaskCreation(formRef.current)
              if (isok) {
                startTransition(() => {
                  setIsLoading(false)
                  router.push("/problems/" + isok + "?is_edit=true")
                })
                return
              }
              else setError("При добавлении задачи произошла ошибка")
              setIsLoading(false)
            }}
          >
            Добавить материалы
          </Button>
        </div>
      </form>
    </div>
  )
}
