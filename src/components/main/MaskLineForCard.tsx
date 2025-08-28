import { FILES_SERVER } from "@/constants/APIEndpoints"
import { JSX } from "react"

export function MaskLineForMenuCard({
  className,
  maskIcon,
  iconH = 100,
  iconW = 120,
}: {
  className: string
  maskIcon: string
  iconH?: number
  iconW?: number
}) {
  return (
    <div
      className={` ${className}`}
      style={{
        WebkitMaskImage: `url('${maskIcon}}')`,
        maskImage: `url('${maskIcon}')`,
        WebkitMaskSize: `${iconW}px ${iconH}px`,
        maskSize: `${iconW}px ${iconH}px`,
        WebkitMaskRepeat: "repeat no-repeat", // повторяем только по X
        maskRepeat: "repeat no-repeat",
        WebkitMaskPosition: "0 center", // одна строка по центру по Y
        maskPosition: "0 center",
        // transform: "rotate(45deg)",
      }}
    />
  )
}
