"use client"

import { Dispatch, ReactNode, SetStateAction, useEffect } from "react"
import style from "@/styles/components/modals.module.css"
import clsx from "clsx"

export default function Modal({
  children,
  openState,
  onClose,
}: {
  children: ReactNode
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  onClose?: () => void
}) {
  const [isOpen, setIsOpen] = openState
  const onOpenInternal = () => {}
  const onCloseInternal = () => {}
  useEffect(() => {}, [isOpen])
  return (
    <div
      className={clsx(style.overlay, { [style.open]: isOpen })}
      onClick={() => {
        setIsOpen(false)
      }}
    >
      <div
        className={style.contentContainer}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </div>
    </div>
  )
}
