import { CSSProperties } from "react"
import { Tooltip } from "@base-ui-components/react"

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
    <Tooltip.Provider>
      <Tooltip.Root delay={300}>
        <Tooltip.Trigger>
          <div
            className="h-4 w-4 rounded-full border-2 border-[var(--color)] bg-[rgba(from_var(--color)_r_g_b/0.25)] transition-colors duration-300 hover:bg-[var(--color)] dark:border-[var(--dark-color)] dark:bg-[rgba(from_var(--dark-color)_r_g_b/0.25)] dark:hover:bg-[var(--dark-color)]"
            style={{ "--color": dotColor, "--dark-color": dotDarkColor } as CSSProperties}
            {...other}
          ></div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={10}>
            <Tooltip.Popup className="transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
              <p
                className="bg-bg-alt rounded-md border-2 border-[var(--color)] p-1 text-[var(--color)] dark:border-[var(--dark-color)] dark:text-[var(--dark-color)]"
                style={{ "--color": dotColor, "--dark-color": dotDarkColor } as CSSProperties}
              >
                {dotTooltipText}
              </p>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
