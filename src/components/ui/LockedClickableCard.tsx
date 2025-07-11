import Link from "next/link"
import { LinkProps } from "next/link"
import style from "@/styles/components/clickableCard.module.css"


interface LockedClickableCardProps extends LinkProps {
  children: React.ReactNode
  className?: string
}

function LockedClickableCard({ children, className, ...linkProps }: LockedClickableCardProps) {
  return (
    <div className={style.clickableCard + " " + (className ?? "")}>
      {children} + LOCKED!!!
    </div>
  )
}

export default LockedClickableCard