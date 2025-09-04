"use client"
import { FaEdit, FaPlus } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { ProblemInterface, ProblemSectionInterface } from "@/types/problemAPI"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { deleteProblem, fetchModifySectionOnTask, fetchAllAvailableSections } from "@/scripts/ApiFetchers"
import { CSSProperties, useEffect, useRef, useState, useTransition } from "react"
import { PiGlobeBold, PiGlobeLight } from "react-icons/pi"
import ProblemSection from "@/components/problems/ProblemSection"
import DeletionConfirmationModal from "./DeletionConfirmationModal"
import { DropdownMulti, DropdownMultiElement, DropdownOptionInterface, DropdownTrigger } from "@/components/ui/Dropdown"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Buttons"
import { useAppSelector, RootState } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { setSections, setIsLoaded } from "@/redux_stores/Global/ProblemSlice"
import { useStore } from "react-redux"
import DotWithTooltip from "@/components/ui/DotWithTooltip"
import { Menu } from "@base-ui-components/react"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import twclsx from "@/utils/twClassMerge"

export default function ProblemCard({ problem, isEditable }: { problem: ProblemInterface; isEditable: boolean }) {
  const [isPendingDeletion, startTransition] = useTransition()
  return (
    <div
      className={twclsx("bg-bg-alt border-border rounded-2xl border-[1px] py-4", {
        "opacity-25": isPendingDeletion,
      })}
    >
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

  const editedProblemNumberRef = useRef<number>(problem.global_number)
  const editedProblemNameRef = useRef<string>(problem.problem_translations[selectedTrnslation].problem_name)
  const editedProblemByRef = useRef<string>(problem.problem_translations[selectedTrnslation].problem_by)
  const editedProblemTextRef = useRef<string>(problem.problem_translations[selectedTrnslation].problem_text)
  const [isEdited, setIsEdited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hoveredScience, setHoveredScience] = useState<number | null>(null)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const router = useRouter()
  const token = useAppSelector((state) => state.auth.token)
  const pathname = usePathname()
  if (!startTransition) startTransition = useTransition()[1]
  const handletaskEdit = async () => {
    if (!isAuthenticated) return
    const formData = new FormData()
    formData.set("problemId", problem.id.toString())
    formData.set("newProblemGlobalNumber", editedProblemNumberRef.current.toString())
    formData.set("newProblemFirstTranslationName", editedProblemNameRef.current)
    formData.set("newProblemFirstTranslationText", editedProblemTextRef.current)
    formData.set("newProblemFirstTranslationBy", editedProblemByRef.current)
    formData.set("token", token)
    const resp = await fetch(PROBLEM_API + "edit_problem", { method: "POST", body: formData })
    return resp.ok
  }
  useEffect(() => {
    if (is_edit_page && !isAuthenticated) {
      router.push("/problems/" + problem.id.toString())
    }
  }, [is_edit_page])

  return (
    <>
      <div className="border-b-border flex flex-col gap-2 border-b-[1px] px-7 pb-3">
        <div className="flex items-center justify-between">
          {is_edit_page && (
            <div className="">
              <Input
                className=""
                name="globalNumber"
                type="number"
                min={1}
                max={20}
                defaultValue={problem.global_number}
                onChange={(event) => {
                  editedProblemNumberRef.current = Number(event.target.value)
                  !isEdited && setIsEdited(true)
                  if (!isEdited) return
                  if (editedProblemNameRef.current !== problem.problem_translations[selectedTrnslation].problem_name)
                    return
                  if (editedProblemTextRef.current !== problem.problem_translations[selectedTrnslation].problem_text)
                    return
                  if (editedProblemNumberRef.current !== problem.global_number) return
                  if (editedProblemByRef.current !== problem.problem_translations[selectedTrnslation].problem_by) return

                  setIsEdited(false)
                }}
              />
              <Input
                className=""
                name="firstTranslationName"
                type="text"
                defaultValue={problem.problem_translations[selectedTrnslation].problem_name}
                onChange={(event) => {
                  editedProblemNameRef.current = event.target.value
                  !isEdited && setIsEdited(true)
                  if (!isEdited) return
                  if (editedProblemNameRef.current !== problem.problem_translations[selectedTrnslation].problem_name)
                    return
                  if (editedProblemTextRef.current !== problem.problem_translations[selectedTrnslation].problem_text)
                    return
                  if (editedProblemNumberRef.current !== problem.global_number) return
                  if (editedProblemByRef.current !== problem.problem_translations[selectedTrnslation].problem_by) return
                  setIsEdited(false)
                }}
              />
            </div>
          )}
          {!is_edit_page && (
            <Link href={"/problems/" + problem.id.toString()}>
              <h2
                className={twclsx("text-text-main text-xl font-bold transition-colors duration-300", {
                  "hover:text-text-hover": !pathname.startsWith("/problems/" + problem.id.toString()),
                })}
              >
                {problem.global_number}
                <span className="font-sans">. </span>
                {problem.problem_translations[selectedTrnslation].problem_name}
              </h2>
            </Link>
          )}
          {isEditable && <EditButtons startTransition={startTransition} problem={problem} />}
        </div>

        {is_edit_page && (
          <div className="">
            <PiGlobeLight />
            <div className="">
              <input
                className="border-border h-full w-full rounded-2xl border-[1px] p-2 text-[0.8rem]"
                defaultValue={problem.problem_translations[selectedTrnslation].problem_by}
                name="newProblemFirstTranslationBy"
                type="text"
                onChange={(event) => {
                  editedProblemByRef.current = event.target.value
                  !isEdited && setIsEdited(true)
                  if (!isEdited) return
                  if (editedProblemNameRef.current !== problem.problem_translations[selectedTrnslation].problem_name)
                    return
                  if (editedProblemTextRef.current !== problem.problem_translations[selectedTrnslation].problem_text)
                    return
                  if (editedProblemNumberRef.current !== problem.global_number) return
                  if (editedProblemByRef.current !== problem.problem_translations[selectedTrnslation].problem_by) return
                  setIsEdited(false)
                }}
              />
            </div>
          </div>
        )}
        {!is_edit_page && (
          <div className="text-text-alt flex items-center gap-2 text-base">
            <PiGlobeBold className="text-2xl" />
            <h2 className="font-bold">{problem.problem_translations[selectedTrnslation].problem_by}</h2>
          </div>
        )}
      </div>
      <div className="px-7 pt-3">
        <p className="text-text-alt pt-3 pb-2 text-xl font-medium">Условие</p>
        {is_edit_page && (
          <div>
            <textarea
              className="border-border h-20 w-full resize-none rounded-2xl border-[1px] p-2"
              name="firstTranslationText"
              defaultValue={problem.problem_translations[selectedTrnslation].problem_text}
              onChange={(event) => {
                editedProblemTextRef.current = event.target.value
                !isEdited && setIsEdited(true)
                if (!isEdited) return
                if (editedProblemNameRef.current !== problem.problem_translations[selectedTrnslation].problem_name)
                  return
                if (editedProblemTextRef.current !== problem.problem_translations[selectedTrnslation].problem_text)
                  return
                if (editedProblemNumberRef.current !== problem.global_number) return
                if (editedProblemByRef.current !== problem.problem_translations[selectedTrnslation].problem_by) return
                setIsEdited(false)
              }}
            />
          </div>
        )}
        {!is_edit_page && (
          <pre>
            <p className="text-text-main text-xl font-medium text-wrap">
              {problem.problem_translations[selectedTrnslation].problem_text}
            </p>
          </pre>
        )}
      </div>

      {is_edit_page && isError && <p className="px-4 py-2 text-[0.9rem] text-[rgb(252_71_71)]">Произошла ошибка</p>}
      {is_edit_page && (
        <Button
          className="text-text-main h-12 w-2xs rounded-xs text-[1.25rem]"
          disabled={isLoading || !isEdited}
          onClick={async () => {
            setIsLoading(true)
            setIsEdited(false)
            setIsError(false)
            const isok = await handletaskEdit()
            if (isok) {
              startTransition(() => {
                router.replace(`/problems/${problem.id}`)
              })
            } else {
              setIsError(true)
              setIsLoading(false)
            }
          }}
        >
          {isLoading && <p>Применяем...</p>}
          {!isLoading && <p>Применить</p>}
        </Button>
      )}

      <div className="px-7">
        <ScienceList problem={problem} setHovered={setHoveredScience} />
        <SectionsList problem={problem} isEditable={is_edit_page || isEditable} hoveredScience={hoveredScience} />
      </div>
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
      <div className="flex gap-1">
        <Link href={"/problems/" + problem.id.toString() + "?is_edit=true"}>
          <FaEdit className="text-accent-primary" />
        </Link>
        <MdDeleteOutline
          className="text-red-600"
          onClick={() => {
            setIsDelModalOpen(true)
          }}
        />
      </div>
      <DeletionConfirmationModal
        problem_global_number={problem.global_number}
        problem_title={problem.problem_translations[0].problem_name}
        openState={isDelModalOpenState}
        onConfirm={async () => {
          const s = await deleteProblem(problem.id, problem.tournament_type)
          if (!s) throw new Error("Deletion has failed")
          startTransition(() => {
            router.refresh()
          })
        }}
      />
    </>
  )
}

function ScienceList({ problem, setHovered }: { problem: ProblemInterface; setHovered: (id: number | null) => void }) {
  return (
    <div className="flex gap-3">
      <h3 className="text-text-alt py-2 pt-3 text-xl font-medium">
        Разделы {problem.sciences.length === 1 ? problem.sciences[0].title.toLowerCase().slice(0, -1) + "и" : "наук"}:
      </h3>
      {problem.sciences.length !== 1 && (
        <div className="flex flex-row content-center items-center justify-start gap-2">
          {problem.sciences.map((value, index) => (
            <DotWithTooltip
              dotColor={value.color}
              dotDarkColor={value.dark_theme_color}
              dotTooltipText={value.title}
              key={index}
              onMouseEnter={() => setHovered(value.id)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SectionsList({
  problem,
  isEditable,
  hoveredScience,
}: {
  problem: ProblemInterface
  isEditable: boolean
  hoveredScience: number | null
}) {
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
          dispatcher(setSections(sections))
          setAddableSections(sections.map((value) => ({ ...value, section_science: value.section_science.id })))
        })
      }
    }
  }, [allSections, dispatcher])
  useEffect(() => {
    setAddableSections(
      (allSections ?? [])
        .filter(
          (section) =>
            problem.problem_sections.find((existing_section) => section.id === existing_section.id) === undefined &&
            section.tournament_type === problem.tournament_type,
        )
        .map((value) => ({ ...value, section_science: value.section_science.id })),
    )
  }, [problem.problem_sections.length, allSections])

  const pathname = usePathname()

  return (
    <div className="flex flex-wrap gap-4 pt-3">
      {problem.problem_sections.map((section) => {
        return (
          <ProblemSection
            isFiltered={!pathname.startsWith("/problems/" + problem.id.toString())}
            isHidden={hoveredScience !== section.section_science && hoveredScience !== null}
            key={section.id}
            section={section}
            isEditable={isEditable}
            problemId={problem.id}
          />
        )
      })}
      {problem.problem_sections.length == 0 && (
        <ProblemSection
          problemId={problem.id}
          section={{
            id: 0,
            title: "Не определено",
            icon_src: "forbidden.svg",
            dark_theme_tile_color: "#AAAAAA",
            tile_color: "#AAAAAA",
            section_science: 0,
            tournament_type: 0,
          }}
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
  const [isError, setIsError] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const defaultColors = {
    "--border-color": "var(--color-accent-primary)",
    "--bg-color": "rgba(from var(--border-color) r g b / 0.125)",
    opacity: 1,
  }
  const [color, setColor] = useState(defaultColors)
  const selectionState = useState<DropdownOptionInterface<number>[] | null>(null)
  const [selectedOptions, setSelectedOption] = selectionState

  useEffect(() => {
    if (isError) {
      setColor((curColor) => {
        const newColor = { ...curColor }
        newColor["--border-color"] = "var(--color-accent-warning)"
        newColor["--bg-color"] = "rgba(from var(--border-color) r g b / 0.125)"
        newColor.opacity = 1
        return newColor
      })
      setTimeout(() => {
        setIsError(false)
      }, 2000)
    } else setColor(defaultColors)
  }, [addableSections, isError])
  return (
    <DropdownMulti
      selectionState={selectionState}
      trigger={
        <DropdownTrigger
          style={color as CSSProperties}
          className={twclsx(
            "hover:bg-bg-alt rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-color)] font-bold text-[var(--border-color)] opacity-100!",
            { "hover:bg-[var(--bg-color)]!": isPending || isError || isLoading },
          )}
          disabled={isPending || isError || isLoading}
          dontDisplaySelection
        >
          <div className="flex min-w-70 flex-row content-center items-center justify-start gap-2">
            <FaPlus />
            {isError || isLoading ? (
              isError ? (
                <p>Ошибка</p>
              ) : (
                <p>Добавляем...</p>
              )
            ) : selectedOptions && selectedOptions?.length > 0 ? (
              <p className="text-nowrap">Добавить {selectedOptions.length} разделов</p>
            ) : (
              <p>Добавить</p>
            )}
          </div>
        </DropdownTrigger>
      }
      onOpenChange={async (open, e, reason, selected) => {
        if (open) return
        if (reason !== "trigger-press") {
          setSelectedOption(null)
          return
        }
        if (!selected || selected.length === 0) return
        setSelectedOption([])
        console.log("fetch->add")
        setColor({
          "--border-color": "rgb(255, 204, 0)",
          "--bg-color": "rgba(255, 204, 0, 0.25)",
          opacity: 1,
        })
        setIsLoading(true)
        const res = await fetchModifySectionOnTask(
          problemId.toString(),
          selected.map((s) => s.value.toString()),
          "add_section",
        )
        setIsLoading(false)
        if (res) {
          startTransition(() => {
            router.refresh()
          })
          return
        }
        setIsError(true)
      }}
    >
      {addableSections.map((section, i) => (
        <DropdownMultiElement value={section.id} key={i + 1}>
          <div className="grid cursor-default grid-cols-[2rem_1fr] items-center gap-1">
            <Menu.CheckboxItemIndicator className="col-start-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={section.tile_color}>
                <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
              </svg>
            </Menu.CheckboxItemIndicator>
            <ProblemSection key={section.id} section={section} problemId={problemId} className="col-start-2" />
          </div>
        </DropdownMultiElement>
      ))}
    </DropdownMulti>
  )
}
