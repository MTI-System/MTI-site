import Link from "next/link"
import { LinkProps } from "next/link"
import style from "@/styles/components/clickableCard.module.css"


interface ClickableCardProps extends LinkProps {
  children: React.ReactNode
  className?: string
}

function ClickableCard({ children, className, ...linkProps }: ClickableCardProps) {
  return (
    <Link  {...linkProps} className={style.clickableCard + " " + (className ?? "")}>
      {children}
    </Link>
  )
}

export default ClickableCard