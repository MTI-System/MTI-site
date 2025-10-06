"use client"
import style from "@/styles/components/ui/Files/imageEmbeddings.module.css"
import clsx from "clsx"
import { ImgHTMLAttributes, startTransition, useState, useTransition } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"
import Modal from "../ui/Modals"
import { MdOutlineClose } from "react-icons/md"
import { DeletionMaterialConfirmationModal } from "./UniversalEmbedding"
import { deleteMaterial } from "@/scripts/ApiFetchers"
import { useRouter } from "next/navigation"
import { EmbeddingInterface } from "@/types/embeddings"
import Image, { ImageProps } from "next/image"

function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

interface ExpandableImageProps extends Omit<ImageProps, "alt" | "width" | "height" | "src"> {
  className?: string
  embedding: EmbeddingInterface
  problemId: number
  isModerator: boolean
  src: string
  onExpand?: () => void
  onShrink?: () => void
}
export function ExpandableImage({
  className,
  onExpand,
  embedding,
  problemId,
  isModerator,
  src,
  ...props
}: ExpandableImageProps) {
  const expandedState = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isexpanded, setIsExpanded] = expandedState
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const checkedSrc = isValidUrl(src as string) ? src : "/placeholder.png"

  return (
    <div
      className={clsx(style.expandableImageContainer, className)}
      onClick={() => {
        setIsExpanded(true)
      }}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      {isModerator && (
        <MdOutlineClose
          className={style.deleteIcons}
          style={{
            position: "absolute",
            margin: "0.5rem",
          }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsDeleteDialogOpen(true)
          }}
        />
      )}

      <Image
        src={checkedSrc}
        {...props}
        width={500}
        height={500}
        placeholder="blur"
        blurDataURL="data:image/png;base64,..."
        alt="Картинка"
        unoptimized={true}
      />

      <div className={style.expandButtonContainer}>
        <FaMagnifyingGlass />
      </div>
      <Modal openState={expandedState}>
        <Image
          src={checkedSrc}
          {...props}
          width={500}
          height={500}
          alt={"./public/placeholder.png"}
          unoptimized={true}
        />
      </Modal>
      <DeletionMaterialConfirmationModal
        openState={[isDeleteDialogOpen, setIsDeleteDialogOpen]}
        problem_global_number={1}
        problem_title={embedding.title}
        onConfirm={async () => {
          const s = await deleteMaterial(problemId, embedding.id)
          if (!s) throw new Error("Deletion has failed")
          startTransition(() => {
            router.refresh()
          })
        }}
      />
    </div>
  )
}
