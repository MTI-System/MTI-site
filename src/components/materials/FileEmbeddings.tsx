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
    <div className="relative flex justify-center items-center content-center shrink-0">
      <img src={FILES_SERVER + embeddingImageURL} />
      {extension && extension.length <= 4 && (
        <p className="absolute bottom-1/4 text-center font-['Roboto Flex Variable'] font-bold leading-[100%] text-[0.8rem] p-[0.05rem] bg-bg-alt border-2 border-border rounded-[0.3rem]" style={{ color: extensionColor, borderColor: extensionColor }}>
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
    <div className="relative border-border border rounded-2xl flex gap-2 overflow-hidden p-2 items-center content-center">
      <EmbeddingIcon {...rest} />
      <div className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        <h4 className="font-normal overflow-hidden whitespace-nowrap text-ellipsis text-text-main">{title}</h4>
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
          <p className="text-text-alt font-mono leading-[100%] h-[1.15rem]">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
