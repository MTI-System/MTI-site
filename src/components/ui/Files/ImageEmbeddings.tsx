"use client"
import style from "@/styles/components/ui/Files/imageEmbeddings.module.css"
import clsx from "clsx"
import { ImgHTMLAttributes, useState } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"
import Modal from "../Modals"

interface ExpandableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  onExpand?: () => void
  onShrink?: () => void
}
export function ExpandableImage({ className, onExpand, ...props }: ExpandableImageProps) {
  const expandedState = useState(false)
  const [isexpanded, setIsExpanded] = expandedState
  return (
    <div
      className={clsx(style.expandableImageContainer, className)}
      onClick={() => {
        setIsExpanded(true)
      }}
    >
      <img {...props} />
      <div className={style.expandButtonContainer}>
        <FaMagnifyingGlass />
      </div>
      <Modal openState={expandedState}>
        <div>File preview is cooming soon!</div>
      </Modal>
    </div>
  )
}
