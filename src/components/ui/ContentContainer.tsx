import { ReactNode } from "react"
import style from "@/styles/components/ui/contentContainer.module.css"

export default function ContentContainer({
  children,
  containerTitle,
}: {
  children: ReactNode
  containerTitle: string

}) {
  return (
    <div className={style.contentContainer}>
      <h2 className={style.containerTitle}>{containerTitle}</h2>
      {children}
    </div>
  )
}
