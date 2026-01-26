import { FILES_SERVER } from "@/constants/APIEndpoints"
import { ReactNode, SyntheticEvent } from "react"

interface EmbeddingIconProps {
  embeddingImageURL: string
  extension?: string
  extensionColor?: string | null
  isExternal?: boolean
}
function EmbeddingIcon({ embeddingImageURL, extension, extensionColor, isExternal }: EmbeddingIconProps) {
  extensionColor = extensionColor ?? "var(--alt-text)"
  return (
    <div className="relative flex shrink-0 content-center items-center justify-center">
      <img src={FILES_SERVER + embeddingImageURL} />
      {extension && extension.length <= 4 && (
        <p
          className="font-['Roboto Flex Variable'] bg-bg-alt border-border absolute bottom-1/4 rounded-[0.3rem] border-2 p-[0.05rem] text-center text-[0.8rem] leading-[100%] font-bold"
          style={{ color: extensionColor, borderColor: extensionColor }}
        >
          {extension}
        </p>
      )}
    </div>
  )
}

interface EmbeddingCardProps extends EmbeddingIconProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export function EmbeddingCard({ children, title, subtitle, isExternal, ...rest }: EmbeddingCardProps) {
  return (
    <div className="border-border relative flex content-center items-center gap-2 overflow-hidden rounded-2xl border p-2">
      <EmbeddingIcon {...rest} />
      <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        <h4 className="text-text-main overflow-hidden font-normal text-ellipsis whitespace-nowrap">{title}</h4>
        <div className="flex items-center gap-1">
          {isExternal && (
            <img
              className="size-4"
              src={`https://${subtitle}/favicon.ico`}
              onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                ;(e.target as HTMLImageElement).src = "/err_favicon.svg"
              }}
            />
          )}
          <p className="text-text-alt h-[1.15rem] font-mono leading-[100%]">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
