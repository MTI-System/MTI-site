import { FILES_SERVER } from "@/constants/APIEndpoints"
import style from "@/styles/components/fileEmbeddings.module.css"

enum EmbeddingIconState {
  default,
  externalLink,
  error,
}

interface EmbeddingIconProps {
  embeddingImageURL: string
  extension?: string
  extensionColor?: string
  iconState: EmbeddingIconState
}

interface UniversalEmbeddingPropas extends Omit<EmbeddingIconProps, "iconState"> {
  embeddingName: string
  url?: string
  full_url?: string
  isDownloadable?: boolean
}

export default function UniversalEmbedding({
  embeddingName,
  url,
  full_url,
  isDownloadable = true,
  ...iconProps
}: UniversalEmbeddingPropas) {
  return (
    <div className={style.embeddingContainer}>
      <EmbeddingIcon iconState={EmbeddingIconState.default} {...iconProps} />
      <div className={style.textContainer}>
        <h4 className={style.embeddingName}>{embeddingName}</h4>
        <p className={style.embeddingSize}>??? KB</p>
      </div>
    </div>
  )
}

function EmbeddingIcon({ embeddingImageURL, extension, extensionColor, iconState }: EmbeddingIconProps) {
  const color = extensionColor ?? "var(--alt-text)"
  return (
    <div className={style.iconContainer}>
      <img src={FILES_SERVER + embeddingImageURL} />
      {extension && (
        <p className={style.extensionTitle} style={{ color: color, borderColor: color }}>
          {extension}
        </p>
      )}
    </div>
  )
}
