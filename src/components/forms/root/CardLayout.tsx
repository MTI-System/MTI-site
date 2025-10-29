"use client"

import twclsx from "@/utils/twClassMerge"
import { useCardsRoot } from "./RootContext"

export function CardLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isEdit } = useCardsRoot()

  return (
    <>
      <div
        className={twclsx(
          "bg-bg-alt border-bg-main flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-500",
          { "hover:border-accent-primary aspect-[8/9] h-[37rem]": !isExpanded },
          { "h-[33rem] w-full": isExpanded },
        )}
      >
        {isExpanded.toString()}
        {isEdit.toString()}
        {children}
      </div>
    </>
  )
}
