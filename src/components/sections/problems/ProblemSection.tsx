"use client"
import { ProblemSectionInterface } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemSection.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { FaTimes } from "react-icons/fa"
import { CSSProperties, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { fetchModifySectionOnTask } from "@/scripts/ApiFetchers"

export default function ProblemSection({
  problemId,
  section,
  isEditable,
}: {
  problemId: number
  section: ProblemSectionInterface
  isEditable?: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <div
      className={clsx(style.sectionCard, { [style.deletionPending]: isPending })}
      style={
        {
          "--bg-color": section.tile_color,
          borderColor: section.tile_color,
          color: section.tile_color,
        } as CSSProperties
      }
    >
      <div
        className={style.sectionLogo}
        style={
          {
            mask: `url(${FILES_SERVER + section.icon_src}) no-repeat  center/contain`,
            WebkitMask: `url(${FILES_SERVER + section.icon_src}) no-repeat center/contain`,
            backgroundColor: section.tile_color,
          } as CSSProperties
        }
      ></div>
      <p>{section.title}</p>
      {isEditable && (
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
    </div>
  )
}
