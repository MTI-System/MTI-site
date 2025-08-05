"use client"
import style from "@/styles/components/ui/Files/imageEmbeddings.module.css"
import clsx from "clsx"
import { ImgHTMLAttributes, startTransition, useState, useTransition } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"
import Modal from "../Modals"
import { MdOutlineClose } from "react-icons/md"
import { DeletionMaterialConfirmationModal } from "./UniversalEmbedding"
import { deleteMaterial } from "@/scripts/ApiFetchers"
import { useRouter } from "next/navigation"
import { EmbeddingInterface } from "@/types/embeddings"

interface ExpandableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  embedding: EmbeddingInterface
  problemId: number
  isModerator: boolean
  onExpand?: () => void
  onShrink?: () => void
}
export function ExpandableImage({ className, onExpand, embedding, problemId, isModerator, ...props }: ExpandableImageProps) {
  const expandedState = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isexpanded, setIsExpanded] = expandedState
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()
  return (
    <div
      className={clsx(style.expandableImageContainer, className)}
      onClick={() => {
        setIsExpanded(true)
      }}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
          {isModerator && <MdOutlineClose className={style.deleteIcons} style={{
            position:"absolute",
            margin: "0.5rem"
          }} onClick={
              (e)=>{
                e.stopPropagation()
                e.preventDefault()
                console.log("delete")
                setIsDeleteDialogOpen(true)
              }
            }/>}
      <img {...props} />

      <div className={style.expandButtonContainer}>
          <FaMagnifyingGlass />
      </div>
      <Modal openState={expandedState}>
        <img {...props} />
      </Modal>
      <DeletionMaterialConfirmationModal openState={[isDeleteDialogOpen, setIsDeleteDialogOpen]}
        problem_global_number={1} problem_title={embedding.title} onConfirm={async ()=>{
            const s = await deleteMaterial(problemId, embedding.id)
            if (!s) throw new Error("Deletion has failed")
            console.log("Delete fetch completed")
            startTransition(() => {
                router.refresh()
            })
            }}
        />
    </div>
    
  )
}
