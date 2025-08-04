"use client"
import { Button } from "@/components/ui/Buttons"
import UniversalEmbedding from "@/components/ui/Files/FileEmbeddings"
import { EmbeddingInterface } from "@/types/embeddings"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import style from "@/styles/components/sections/problems/[id]/embeddingAddition.module.css"
import { RiFileAddLine } from "react-icons/ri"
import Modal from "@/components/ui/Modals"
import ContentContainer from "@/components/ui/ContentContainer"
import AddFileField from "@/components/ui/Files/AddFileField"

interface PendingEmbeddingInterface {
  file: File
  embeddingData: EmbeddingInterface
}
export default function PendingEmbeddingsList() {
  const isOpenState = useState(false)
  const [isOpen, setIsOpen] = isOpenState
  const [embeddings, setEmbeddings] = useState<PendingEmbeddingInterface[]>([])
  return (
    <>
      <Button
        className={style.addMaterialButton}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <RiFileAddLine className={style.addIcon} />
        <h4 className={style.addTitle}>Добавить материал</h4>
      </Button>
      <AddFileModal openState={isOpenState} onFileAdd={() => {}} />
    </>
  )
}

function AddFileModal({
  openState,
  onFileAdd,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  onFileAdd: (file: File) => void
}) {
  return (
    <Modal openState={openState}>
      <div className={style.modalContentCotainer}>
        <ContentContainer containerTitle="Контент">
          <div className={style.spacer}>
            <AddFileField
              onFileSet={(f) => {
                console.log(f)
              }}
            />
          </div>
        </ContentContainer>
      </div>
    </Modal>
  )
}
