"use client"
import { FaEdit, FaPlus } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { ProblemInterface, ProblemSectionInterface } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemCard.module.css"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { deleteProblem, fetchModifySectionOnTask, fetchAllAvailableSections } from "@/scripts/ApiFetchers"
import { CSSProperties, useEffect, useMemo, useRef, useState, useTransition } from "react"
import clsx from "clsx"
import { PiGlobeLight } from "react-icons/pi"
import ProblemSection from "@/components/sections/problems/ProblemSection"
import DeletionConfirmationModal from "./DeletionConfirmationModal"
import { Dropdown } from "@/components/ui/Dropdown"
import { Input, TitledInput } from "@/components/ui/Input"
import { Button } from "@/components/ui/Buttons"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { useAppSelector, RootState } from "@/redux_stores/tournamentTypeRedixStore"
import { router } from "next/client"
import { useAppDispatch } from "@/redux_stores/tournamentTypeRedixStore"
import { setSections, setIsLoaded } from "@/redux_stores/ProblemSlice"
import { useStore } from "react-redux"

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
  const searchParams = useSearchParams()
  const is_edit_page = searchParams.get("is_edit") === "true"

  const [editedProblemNumber, setEditedProblemNumber] = useState(problem.global_number)
  const [editedProblemName, setEditedProblemName] = useState(
    problem.problem_translations[selectedTrnslation].problem_name
  )
  const [editedProblemText, setEditedProblemText] = useState(
    problem.problem_translations[selectedTrnslation].problem_text
  )
  const [isEdited, setIsEdited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const router = useRouter()
  const token = useAppSelector((state) => state.auth.token)

  const handletaskEdit = async () => {
    if (!isAuthenticated) return
    const formData = new FormData()
    formData.set("problemId", problem.id.toString())
    formData.set("newProblemGlobalNumber", editedProblemNumber.toString())
    formData.set("newProblemFirstTranslationName", editedProblemName)
    formData.set("newProblemFirstTranslationText", editedProblemText)
    formData.set("token", token)

    const resp = await fetch(PROBLEM_API + "edit_problem", { method: "POST", body: formData })
    // if (resp.ok) form.reset()
    return resp.ok
  }

  useEffect(() => {
    if (
      editedProblemNumber !== problem.global_number ||
      editedProblemName !== problem.problem_translations[selectedTrnslation].problem_name ||
      editedProblemText !== problem.problem_translations[selectedTrnslation].problem_text
    ) {
      setIsEdited(true)
    } else {
      setIsEdited(false)
    }
  }, [editedProblemNumber, editedProblemName, editedProblemText])

  useEffect(() => {
    if (is_edit_page && !isAuthenticated) {
      router.push("/problems/" + problem.id.toString())
    }
  }, [is_edit_page])

  return (
    <>
      <div className={style.cardHeader}>
        <div className={style.titleContainer}>
          {!startTransition && is_edit_page && (
            <div className={style.editProblemLineDiv}>
              <Input
                className={style.problemNumberInput}
                name="globalNumber"
                type="number"
                min={1}
                max={20}
                defaultValue={problem.global_number}
                onChange={(event) => setEditedProblemNumber(Number(event.target.value))}
              />
              <Input
                className={style.problemNameInput}
                name="firstTranslationName"
                type="text"
                defaultValue={problem.problem_translations[selectedTrnslation].problem_name}
                onChange={(event) => setEditedProblemName(event.target.value)}
              />
            </div>
          )}
          {!(!startTransition && is_edit_page) && (
            <Link href={"/problems/" + problem.id.toString()}>
              <h2 className={style.problemTitle}>
                {problem.global_number}.{problem.problem_translations[selectedTrnslation].problem_name}
              </h2>
            </Link>
          )}
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
        {!startTransition && is_edit_page && (
          <div>
            <textarea
              className={style.problemTextEditArea}
              name="firstTranslationName"
              defaultValue={problem.problem_translations[selectedTrnslation].problem_text}
              onChange={(event) => setEditedProblemText(event.target.value)}
            />
          </div>
        )}
        {!(!startTransition && is_edit_page) && (
          <p className={style.problemText}>{problem.problem_translations[selectedTrnslation].problem_text}</p>
        )}
      </div>
      {!startTransition && is_edit_page && (
        <Button
          className={style.confirmEditButton}
          disabled={!isEdited}
          onClick={async () => {
            setIsLoading(true)
            setIsEdited(false)
            const isok = await handletaskEdit()
            if (isok) {
              setIsLoading(false)
            } else {
              setIsEdited(true)
            }
          }}
        >
          {isLoading && <p>Применение изменений</p>}
          {!isLoading && <p>Применить изменения</p>}
        </Button>
      )}

      <div className={style.sectionListContainer}>
        <h3>Разделы физики:</h3>
        <SectionsList problem={problem} isEditable={is_edit_page || isEditable} />
      </div>
      {/*</form>*/}
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
        <Link href={"/problems/" + problem.id.toString() + "?is_edit=true"}>
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
  // const [addableSections, setAddableSections] = useState<ProblemSectionInterface[]>([])\
  const store = useStore<RootState>()
  const allSections = useAppSelector((state) => state.problems.sections)
  const [addableSections, setAddableSections] = useState<ProblemSectionInterface[]>([])
  const isSectionLoading = useAppSelector((state) => state.problems.isLoaded)
  const dispatcher = store.dispatch

  useEffect(() => {
    if (allSections === null && !isSectionLoading) {
      const { isLoaded: freshLoaded } = store.getState().problems
      if (!freshLoaded) {
        dispatcher(setIsLoaded())
        fetchAllAvailableSections().then((sections) => {
          console.log("Sections", sections)
          dispatcher(setSections(sections))
          setAddableSections(sections)
        })
      }
    }
  }, [allSections, dispatcher])

  useEffect(() => {
    console.log("Filter Sections", allSections)
    setAddableSections(
      (allSections ?? []).filter(
        (section) =>
          problem.problem_sections.find((existing_section) => section.id === existing_section.id) === undefined
      )
    )
  }, [problem.problem_sections.length, allSections])

  return (
    <div className={style.sectionsList}>
      {problem.problem_sections.map((section) => {
        return <ProblemSection key={section.id} section={section} isEditable={isEditable} problemId={problem.id} />
      })}
      {problem.problem_sections.length == 0 && (
        <ProblemSection
          problemId={problem.id}
          section={{ id: 0, title: "Не определено", icon_src: "forbidden.svg", tile_color: "#AAAAAA" }}
        />
      )}
      {isEditable && <AddNewSection problemId={problem.id} addableSections={addableSections ?? []} />}
    </div>
  )
}

function AddNewSection({
  problemId,
  addableSections,
}: {
  problemId: number
  addableSections: ProblemSectionInterface[]
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
  }, [addableSections, isError])

  return (
    <>
      <Dropdown
        options={addableSections.map((section) => {
          return {
            displayElement: (
              <div className={style.addSectionOptionContainer}>
                <ProblemSection key={section.id} section={section} problemId={problemId} />
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
          const res = await fetchModifySectionOnTask(problemId.toString(), sel, "add_section")
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
