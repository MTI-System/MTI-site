import Link from "next/link"
import { LinkProps } from "next/link"
import "@/styles/components/clickableCard.css"

interface ClickableCardProps extends LinkProps {
  children: React.ReactNode
  className?: string
}

function ClickableCard({ children, className, ...linkProps }: ClickableCardProps) {
  return (
    <Link  {...linkProps} className={"clickableCard " + (className ?? "")}>
      {children}
    </Link>
  )
}

export default ClickableCard