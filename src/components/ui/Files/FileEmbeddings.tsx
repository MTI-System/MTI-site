import { FILES_SERVER } from "@/constants/APIEndpoints"
import style from "@/styles/components/ui/Files/fileEmbeddings.module.css"
import { EmbeddingInterface } from "@/types/embeddings"

export default function UniversalEmbedding({ embedding }: { embedding: EmbeddingInterface }) {
  console.log(embedding)
  return (
    <div className={style.embeddingContainer}>
      <EmbeddingIcon
        embeddingImageURL={embedding.content_type.icon_source}
        extension={embedding.metadata.extension}
        isExternal={embedding.metadata.is_external === "true"}
      />
      <div className={style.textContainer}>
        <h4 className={style.embeddingName}>{embedding.title}</h4>
        <p className={style.embeddingSize}>??? KB</p>
      </div>
    </div>
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
