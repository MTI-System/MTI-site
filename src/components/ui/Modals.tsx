"use client"

import { Dispatch, ReactNode, SetStateAction, useEffect } from "react"
import style from "@/styles/components/modals.module.css"
import clsx from "clsx"

export default function Modal({
  children,
  openState,
  onClose,
  preventClose,
}: {
  children: ReactNode
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  onClose?: () => void
  preventClose?: boolean
}) {
  const [isOpen, setIsOpen] = openState
  const onOpenInternal = () => {}
  const onCloseInternal = () => {
    if (onClose) onClose()
  }
  useEffect(() => {
    if (!isOpen) return
    onOpenInternal()
  }, [isOpen])
  return (
    <div
      className={clsx(style.overlay, { [style.open]: isOpen })}
      onClick={() => {
        if (preventClose) return
        onCloseInternal()
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
