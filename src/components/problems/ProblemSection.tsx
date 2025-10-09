"use client"
import { ProblemSectionInterface } from "@/types/problemAPI"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { FaTimes } from "react-icons/fa"
import { CSSProperties, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FaFilter } from "react-icons/fa"
import twclsx from "@/utils/twClassMerge"
import { Tooltip } from "@base-ui-components/react"
import { setSectionList } from "@/redux_stores/Problems/ProblemsFiltersSlice"
import { useProblemsDispatch, useProblemsSelector } from "@/components/Redux/ProblemsStoreContext"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useModifySectionOnTaskMutation } from "@/api/problems/clientApiInterface"

function FilterButton({ section }: { section: ProblemSectionInterface }) {
  const dispatcher = useProblemsDispatch()
  const filteredSections = useProblemsSelector((state) => state.problemsPageFilters.sectionList)

  const handleFilterClick = () => {
    if (filteredSections === null) {
      const newSections = [section.id]
      dispatcher(setSectionList(newSections))
    } else if (!filteredSections?.find((sec) => sec === section.id)) {
      const newSections = [...filteredSections]
      newSections.push(section.id)
      dispatcher(setSectionList(newSections))
    }
  }

  return (
    <Tooltip.Provider>
      <Tooltip.Root delay={200}>
        <Tooltip.Trigger>
          <FaFilter className="cursor-pointer text-[0.6rem]" onClick={handleFilterClick} />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={10}>
            <Tooltip.Popup className="transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
              <p className="border-border bg-bg-alt text-text-main rounded-md border-2 px-2 py-1">Добавить в фильтр</p>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default function ProblemSection({
  problemId,
  section,
  isEditable,
  isHidden = false,
  isFiltered = false,
  className,
}: {
  problemId?: number
  section: ProblemSectionInterface
  isEditable?: boolean
  isHidden?: boolean
  isFiltered?: boolean
  className?: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const token = useAppSelector((state) => state.auth.token)

  // TODO: add error handling

  const [deleteSectionMutation, { isSuccess }] = useModifySectionOnTaskMutation()
  useEffect(() => {
    if (isSuccess) {
      startTransition(() => {
        router.refresh()
      })
    }
    console.log("isSuccess", isSuccess)
  }, [isSuccess])

  return (
    <div
      className={twclsx(
        "flex items-center gap-2 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-0.5 font-bold text-[var(--border-color)] dark:border-[var(--border-color-dark)] dark:bg-[var(--bg-color-dark)] dark:text-[var(--border-color-dark)]",
        className,
        { "opacity-50": isPending || isHidden },
      )}
      style={
        {
          "--bg-color": section.tile_color + "33",
          "--border-color": section.tile_color,
          "--bg-color-dark": section.dark_theme_tile_color + "33",
          "--border-color-dark": section.dark_theme_tile_color,
        } as CSSProperties
      }
    >
      <div
        className="h-5 w-5 bg-[var(--border-color)] mask-contain dark:bg-[var(--border-color-dark)]"
        style={
          {
            mask: `url(${FILES_SERVER + section.icon_src}) no-repeat  center/contain`,
            WebkitMask: `url(${FILES_SERVER + section.icon_src}) no-repeat center/contain`,
          } as CSSProperties
        }
      ></div>
      <p className="text-base select-none">{section.title}</p>
      {isEditable && problemId && (
        <FaTimes
          className="cursor-pointer text-[0.8rem]"
          onClick={() => {
            deleteSectionMutation({
              problemId: problemId.toString(),
              sectionIds: section.id.toString(),
              action: "delete_section",
              token: token,
            })
          }}
        />
      )}
      {isFiltered && <FilterButton section={section} />}
    </div>
  )
}
