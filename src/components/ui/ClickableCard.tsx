import Link from "next/link"
import { LinkProps } from "next/link"
import style from "@/styles/components/ui/clickableCard.module.css"
import clsx from "clsx"

interface ClickableCardProps extends LinkProps {
  children: React.ReactNode
  className?: string
}

function ClickableCard({ children, className, ...linkProps }: ClickableCardProps) {
  return (
    <Link {...linkProps} className={clsx("rounded-3xl", className)} draggable={false}>
      {children}
    </Link>
  )
}

export default ClickableCard
