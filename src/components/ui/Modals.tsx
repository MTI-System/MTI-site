"use client"

import twclsx from "@/utils/twClassMerge"
import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect } from "react"
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
  const onCloseInternal = (e: MouseEvent | React.KeyboardEvent<HTMLDivElement>) => {
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
    <div
      className={twclsx(
        "fixed top-0 left-0 z-10 hidden h-screen w-screen content-center items-center justify-center bg-black/50",
        {
          flex: isOpen,
        },
      )}
      onClick={onCloseInternal}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCloseInternal(e)
      }}
    >
      <div
        className="bg-bg-alt relative max-h-[90%] w-[90%] max-w-[90%] overflow-auto rounded-2xl p-10 sm:w-auto sm:rounded-4xl"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {!preventClose && (
          <button
            className="text-text-main disabled:text-text-alt absolute top-4 right-3 size-5 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Close modal"
            disabled={preventClose}
            onClick={onCloseInternal}
          >
            <FaTimes />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
