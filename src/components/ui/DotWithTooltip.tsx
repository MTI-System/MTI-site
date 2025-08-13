import { CSSProperties } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"
import style from "@/styles/components/ui/dotWithTooltim.module.css"

export default function DotWithTooltip({
  dotColor,
  dotDarkColor,
  dotTooltipText,
  ...other
}: {
  dotColor: string
  dotDarkColor: string
  dotTooltipText: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={style.dot}
          style={{ "--color": dotColor, "--dark-color": dotDarkColor } as CSSProperties}
          {...other}
        ></div>
      </TooltipTrigger>
      <TooltipContent>
        <p className={style.tooltip} style={{ "--color": dotColor, "--dark-color": dotDarkColor } as CSSProperties}>
          {dotTooltipText}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
