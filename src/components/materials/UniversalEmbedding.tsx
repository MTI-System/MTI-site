"use client"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { EmbeddingInterface } from "@/types/embeddings"
import { EmbeddingCard } from "./FileEmbeddings"
import { MdOutlineClose } from "react-icons/md"
import { Dispatch, SetStateAction, startTransition, useEffect, useState, useTransition } from "react"
import Modal from "../ui/Modals"
import { PiWarningBold } from "react-icons/pi"
import style from "@/styles/components/sections/problems/deletionConfirmation.module.css"
import styleDelete from "@/styles/components/ui/Files/imageEmbeddings.module.css"
import { Button, HoldButton } from "../ui/Buttons"
import { deleteMaterial } from "@/scripts/ApiFetchers"
import { useRouter } from "next/navigation"

export default function UniversalEmbedding({ embedding, problemId, isModerator }: { embedding: EmbeddingInterface, problemId: number, isModerator: boolean }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const url = embedding.metadata.is_external == "true" ? embedding.content : FILES_SERVER + embedding.content
  const sub =
    embedding.metadata.is_external == "true"
      ? embedding.content.split("/")[2]
      : (Number(embedding.metadata.file_size) / (8 * 1024)).toFixed(2).toString() + " КБ"

  return (
    <>
        <a href={url} target="_blank" style={{ opacity: isPending ? 0.5 : 1 }}>
          <EmbeddingCard
            title={embedding.title}
            subtitle={sub}
            embeddingImageURL={embedding.content_type.icon_source}
            extensionColor={embedding.metadata.extension_color}
            extension={embedding.metadata.extension}
            isExternal={embedding.metadata.is_external === "true"}
          >
            {isModerator && <MdOutlineClose className={styleDelete.deleteIcons} onClick={
                (e)=>{
                  e.stopPropagation()
                  e.preventDefault()
                    setIsDeleteDialogOpen(true)
                }
            }/>}

          </EmbeddingCard>

        </a>
        <DeletionMaterialConfirmationModal openState={[isDeleteDialogOpen, setIsDeleteDialogOpen]}
        problem_global_number={1} problem_title={embedding.title} onConfirm={async ()=>{
            const s = await deleteMaterial(problemId, embedding.id)
            if (!s) throw new Error("Deletion has failed")
            startTransition(() => {
                router.refresh()
            })
            }}
        />
    </>
  )
}


export function DeletionMaterialConfirmationModal({
  openState,
  problem_global_number,
  problem_title,
  onConfirm,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  problem_global_number: number
  problem_title: string
  onConfirm: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = openState
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!isOpen) setIsError(false)
  }, [isOpen])

  return (
    <Modal openState={openState} preventClose={isLoading}>
      <div className={style.deletionModalInfoContainer}>
        <h1>Удалить материал?</h1>
        <p>
          Вы действительно хотите удалить материал {problem_title}?
        </p>
        <div className={style.warningBlock}>
          <div className={style.warningHeader}>
            <PiWarningBold />
            <h2>Внимание!</h2>
            <PiWarningBold />
          </div>
          <p>
            При удалении материала он будет удален НАВСЕГДА. Вы уверены, что вы
            хотите удалить материал?
          </p>
        </div>
        {isError && <p className={style.errormessage}>Произошла неизвестная ошибка, повторите попытку позже</p>}
        <div className={style.buttonsContainer}>
          <Button
            onClick={() => {
              if (isLoading) return
              setIsOpen(false)
              setIsError(false)
            }}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <HoldButton
            style={{ "--main-color": "var(--warning-accent)", "--main-light-color": "var(--alt-warning-accent)" }}
            onConfirm={() => {
              if (isLoading) return
              setIsLoading(true)
              setIsError(false)
              onConfirm()
                .then(() => {
                  setIsLoading(false)
                  setIsOpen(false)
                })
                .catch(() => {
                  setIsLoading(false)
                  setIsError(true)
                })
            }}
            disabled={isLoading}
          >
            {!isLoading && <>Удалить</>}
            {isLoading && <>Загрузка...</>}
          </HoldButton>
        </div>
      </div>
    </Modal>
  )
}
