"use client"
import { ProblemSectionInterface } from "@/types/problemAPI"
import style from "@/styles/components/sections/problems/problemSection.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { FaTimes } from "react-icons/fa"
import { CSSProperties, useTransition } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { fetchDeleteSectionFromTask } from "@/scripts/ApiFetchers"

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
      <img className={style.icon} src={FILES_SERVER + section.icon_src} />
      <p>{section.title}</p>
      {isEditable && (
        <FaTimes
          className={style.deleteIcon}
          onClick={() => {
            // TODO: Create logic for section deletion
            startTransition(async () => {
              const response = await fetchDeleteSectionFromTask(problemId.toString(), section.id.toString())
              if (!response) return
              router.refresh()
            })
          }}
        />
      )}
    </div>
  )
}
