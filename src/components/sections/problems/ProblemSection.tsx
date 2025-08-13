"use client"
import { ProblemSectionInterface } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemSection.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { FaTimes } from "react-icons/fa"
import { CSSProperties, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { fetchModifySectionOnTask } from "@/scripts/ApiFetchers"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setSectionList } from "@/redux_stores/SearchParamsSlice"
import { FaFilter } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"

export default function ProblemSection({
  problemId,
  section,
  isEditable,
  isHidden = false,
  isFiltered = false,
}: {
  problemId?: number
  section: ProblemSectionInterface
  isEditable?: boolean
  isHidden?: boolean
  isFiltered?: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const dispatcher = useDispatch()
  const filteredSections = useAppSelector((state) => state.searchParams.sectionList)
  const router = useRouter()
  return (
    <div
      className={clsx(style.sectionCard, { [style.deletionPending]: isPending })}
      style={
        {
          "--bg-color": section.tile_color,
          "--bg-color-dark": section.dark_theme_tile_color,
          opacity: isHidden ? 0.5 : 1,
        } as CSSProperties
      }
    >
      <div
        className={style.sectionLogo}
        style={
          {
            mask: `url(${FILES_SERVER + section.icon_src}) no-repeat  center/contain`,
            WebkitMask: `url(${FILES_SERVER + section.icon_src}) no-repeat center/contain`,
          } as CSSProperties
        }
      ></div>
      <p>{section.title}</p>
      {isEditable && problemId && (
        <FaTimes
          className={style.deleteIcon}
          onClick={() => {
            startTransition(async () => {
              const response = await fetchModifySectionOnTask(
                problemId.toString(),
                section.id.toString(),
                "delete_section"
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
            {/* <button
              className="size-3"

            ></button> */}
          </TooltipTrigger>
          <TooltipContent>
            <p className="bg-[var(--inactive-color)] px-2 py-1 rounded-xl">Добавить в фильтр</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
