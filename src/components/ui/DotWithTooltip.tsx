import { CSSProperties } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"
import style from "@/styles/components/ui/dotWithTooltim.module.css"

export default function DotWithTooltip({ dotColor, dotDarkColor, dotTooltipText }: { dotColor: string; dotDarkColor: string; dotTooltipText: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={style.dot}
          style={{ "--color": dotColor, "--dark-color": dotDarkColor } as CSSProperties}
        ></div>
      </TooltipTrigger>
      <TooltipContent>
        <p className={style.tooltip} style={{"--color": dotColor} as CSSProperties}>{dotTooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}
