"use client"
import { ProblemSectionInterface } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemSection.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { FaTimes } from "react-icons/fa"
import { CSSProperties, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { fetchModifySectionOnTask } from "@/scripts/ApiFetchers"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setSectionList } from "@/redux_stores/SearchParamsSlice"
import { FaFilter } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import twclsx from "@/utils/twClassMerge"

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
  const dispatcher = useDispatch()
  const filteredSections = useAppSelector((state) => state.searchParams.sectionList)
  const router = useRouter()
  return (
    <div
      className={twclsx(
        "py-0.3 flex items-center gap-2 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-color)] px-2 font-bold text-[var(--border-color)] dark:border-[var(--border-color-dark)] dark:bg-[var(--bg-color-dark)] dark:text-[var(--border-color-dark)]",
        { "opacity-50": isPending },
      )}
      style={
        {
          "--bg-color": section.tile_color + "33",
          "--border-color": section.tile_color,
          "--bg-color-dark": section.dark_theme_tile_color + "33",
          "--border-color-dark": section.dark_theme_tile_color,
          opacity: isHidden ? 0.5 : 1,
        } as CSSProperties
      }
    >
      <div
        className={style.sectionLogo} //TODO Иконку на tailwind переделать
        style={
          {
            mask: `url(${FILES_SERVER + section.icon_src}) no-repeat  center/contain`,
            WebkitMask: `url(${FILES_SERVER + section.icon_src}) no-repeat center/contain`,
          } as CSSProperties
        }
      ></div>
      <p className="text-base">{section.title}</p>
      {isEditable && problemId && (
        <FaTimes
          className={style.deleteIcon}
          onClick={() => {
            startTransition(async () => {
              const response = await fetchModifySectionOnTask(
                problemId.toString(),
                section.id.toString(),
                "delete_section",
              )
              if (!response) return
              router.refresh()
            })
          }}
        />
      )}
      {isFiltered && (
        <Tooltip>
          <TooltipTrigger>
            <FaFilter
              className="text-[0.6rem]"
              onClick={() => {
                if (filteredSections === null) {
                  const newSections = [section.id]
                  dispatcher(setSectionList(newSections))
                } else if (!filteredSections?.find((sec) => sec === section.id)) {
                  const newSections = [...filteredSections]
                  newSections.push(section.id)
                  dispatcher(setSectionList(newSections))
                }
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="rounded-xl bg-[var(--inactive-color)] px-2 py-1">Добавить в фильтр</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
