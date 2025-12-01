"use client"
import { useEffect, useState, useTransition } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"
import Modal from "../ui/Modals"
import { MdOutlineClose } from "react-icons/md"
import { DeletionMaterialConfirmationModal } from "./UniversalEmbedding"
import { useRouter } from "next/navigation"
import { EmbeddingInterface } from "@/types/embeddings"
import Image, { ImageProps } from "next/image"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useDeleteMaterialMutation } from "@/api/problems/clientApiInterface"
import twclsx from "@/utils/twClassMerge"

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
  problemId?: number
  isModerator?: boolean
  src: string
  onExpand?: () => void
  onShrink?: () => void
}
export function ExpandableImage({
  className,
  onExpand,
  embedding,
  problemId,
  isModerator = false,
  src,
  ...props
}: ExpandableImageProps) {
  const expandedState = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isexpanded, setIsExpanded] = expandedState
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const token = useAppSelector((state) => state.auth.token)
  const [deleteMaterialMutation, { isSuccess }] = useDeleteMaterialMutation()
  useEffect(() => {
    if (isSuccess) {
      startTransition(() => {
        router.refresh()
      })
    }
  }, [isSuccess])

  const checkedSrc = isValidUrl(src as string) ? src : "/placeholder.png"

  return (
    <div
      className={twclsx(
        "border-border relative h-full overflow-hidden rounded-2xl border max-w-fit w-full",
        className,
      )}
      onClick={() => {
        setIsExpanded(true)
      }}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      {isModerator && (
        <MdOutlineClose
          className="aspect-1 absolute top-2 right-2 z-9 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white object-contain text-2xl text-black"
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
        className="h-full w-auto max-w-fit object-contain"
        width={500}
        height={500}
        placeholder="blur"
        blurDataURL="data:image/png;base64,..."
        alt="Картинка"
        unoptimized={true}
      />

      <div className="absolute top-0 flex h-full w-full items-center justify-center rounded-tl-2xl bg-black/10 text-4xl text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:opacity-100">
        <FaMagnifyingGlass />
      </div>
      <Modal openState={expandedState}>
        <Image
          src={checkedSrc}
          className="select-none"
          {...props}
          width={500}
          height={500}
          alt={"./public/placeholder.png"}
          unoptimized={true}
        />
      </Modal>
      <DeletionMaterialConfirmationModal
        openState={[isDeleteDialogOpen, setIsDeleteDialogOpen]}
        problem_title={embedding.title}
        onConfirm={async () => {
          if (!problemId) return
          deleteMaterialMutation({ problemId: problemId, materialId: embedding.id, token: token })
        }}
      />
    </div>
  )
}
