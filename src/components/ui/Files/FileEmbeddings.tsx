import { FILES_SERVER } from "@/constants/APIEndpoints"
import style from "@/styles/components/ui/Files/fileEmbeddings.module.css"
import { EmbeddingInterface } from "@/types/embeddings"
import {ReactNode, SyntheticEvent} from "react"
import Image from "next/image";




interface EmbeddingIconProps {
  embeddingImageURL: string
  extension?: string
  extensionColor?: string | null
  isExternal?: boolean
}
function EmbeddingIcon({ embeddingImageURL, extension, extensionColor, isExternal }: EmbeddingIconProps) {
  extensionColor = extensionColor ?? "var(--alt-text)"
  return (
    <div className={style.iconContainer}>
      <img src={FILES_SERVER + embeddingImageURL} />
      {extension && extension.length <= 4 && (
        <p className={style.extensionTitle} style={{ color: extensionColor, borderColor: extensionColor }}>
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
    <div className={style.embeddingContainer}>
      <EmbeddingIcon {...rest} />
      <div className={style.textContainer}>
        <h4 className={style.embeddingName}>{title}</h4>
        <div className="flex items-center gap-1 ">
          {isExternal && <img className="size-4" src={`https://${subtitle}/favicon.ico`} onError={(e: SyntheticEvent<HTMLImageElement, Event>)=>{
            (e.target as HTMLImageElement).src = "/err_favicon.svg"
          }} />}
          <p className={style.embeddingSize}>{subtitle}</p>
        </div>

      </div>
      {children}

    </div>
  )
}
