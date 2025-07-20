"use client"
import { Button } from "@/components/ui/Buttons"
import { useEffect, useState } from "react"
import ModalDialog from "@/components/Dialogs/ModalDialog"
import NewProblemForm from "@/components/Dialogs/Forms/NewProblemForm"
import AcceptDialog from "@/components/Dialogs/Forms/AcceptDialog"
import { User } from "@/types/authApi"
import { useRouter, useSearchParams } from "next/navigation"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import cookies from "js-cookie"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

function AddNewProblem({ userData }: { userData: User }) {
  const [modalDialogState, setDialogState] = useState(0)
  const [newProblemData, setNewProblemData] = useState<NewProblemFormData>()

  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number>(200)
  useEffect(() => {
    const savedToken = cookies.get("mtiyt_auth_token")?.valueOf()

    if (!savedToken) {
      router.push("/login" + "?redirect=" + "organization/problems")
      return
    }
    setToken(savedToken)
  }, [])

  const searchParams = useSearchParams()
  const tt = searchParams.get("tt") ?? undefined
  const year = Number(searchParams.get("year") ?? 2025)
  const tournamentTypeId = availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1
  return (
    <>
      <div>
        <Button
          disabled={userData.rights
            .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + tournamentTypeId.toString())
            .every((x) => !x)}
          onClick={() => setDialogState(1)}
        >
          Добавить задачу
        </Button>
        {/*Форма для добавления задачи*/}
        <ModalDialog isOpen={modalDialogState == 1} onClose={() => {}}>
          <NewProblemForm
            setModalState={setDialogState}
            setNewProblemData={setNewProblemData}
            currentTournamentType={tournamentTypeId}
            currentYear={year}
          />
        </ModalDialog>
        {/*Подтверждение добавления*/}
        <ModalDialog isOpen={modalDialogState == 2} onClose={() => {}}>
          <AcceptDialog
            onAccept={() => {
              {
                setDialogState(0)
                const formData = new FormData()
                formData.set("globalNumber", newProblemData!!.globalNumber.toString())
                formData.set("year", newProblemData!!.year.toString())
                formData.set("tournamentType", newProblemData!!.tournamentType.toString())
                formData.set("firstTranslationName", newProblemData!!.firstTranslationName)
                formData.set("firstTranslationText", newProblemData!!.firstTranslationText)
                formData.set("firstTranslationBy", newProblemData!!.firstTranslationBy)
                formData.set("authToken", token!!)

                fetch(PROBLEM_API + "add_problem", { method: "POST", body: formData }).then((res) => {
                  setStatusCode(res.status)
                })
                if (statusCode != 200) {
                  console.log("ERRORRRR!!!!")
                } else {
                  router.refresh()
                  console.log("ALL OK")
                }
              }
            }}
            onDecline={() => {
              setDialogState(0)
            }}
          />
        </ModalDialog>
      </div>
    </>
  )
}

export default AddNewProblem
