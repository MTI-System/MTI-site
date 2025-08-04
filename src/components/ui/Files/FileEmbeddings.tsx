import { FILES_SERVER } from "@/constants/APIEndpoints"
import style from "@/styles/components/ui/Files/fileEmbeddings.module.css"
import { EmbeddingInterface } from "@/types/embeddings"
import { ReactNode } from "react"

export default function UniversalEmbedding({ embedding }: { embedding: EmbeddingInterface }) {
  return (
    <EmbeddingCard
      title={embedding.title}
      subtitle={"???KB"}
      embeddingImageURL={embedding.content_type.icon_source}
      extension={embedding.metadata.extension}
      isExternal={embedding.metadata.is_external === "true"}
    ></EmbeddingCard>
  )
}

interface EmbeddingIconProps {
  embeddingImageURL: string
  extension?: string
  extensionColor?: string
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
        <p className={style.embeddingSize}>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
