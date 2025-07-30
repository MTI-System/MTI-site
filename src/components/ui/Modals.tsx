"use client"

import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect } from "react"
import style from "@/styles/components/ui/modals.module.css"
import clsx from "clsx"
import { FaTimes } from "react-icons/fa"

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
  const onCloseInternal = (e: MouseEvent) => {
    e.stopPropagation()
    if (preventClose) return
    setIsOpen(false)
    if (onClose) onClose()
  }
  useEffect(() => {
    if (!isOpen) return
    onOpenInternal()
  }, [isOpen])
  return (
    <div className={clsx(style.overlay, { [style.open]: isOpen })} onClick={onCloseInternal}>
      <div
        className={style.contentContainer}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <button
          className={style.modalCloseButton}
          aria-label="Close modal"
          disabled={preventClose}
          onClick={onCloseInternal}
        >
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  )
}
