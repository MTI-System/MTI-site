"use client"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { LoadMaterialForm } from "@/types/embeddings"
import { useState, useEffect, useRef, CSSProperties } from "react"
import { EmbeddingCard } from "../FileEmbeddings"
import axios from "axios"
import { MdOutlineRefresh, MdOutlineClose } from "react-icons/md"

export default function LoadingFileEmbedding({
  form,
  onUploadComplete,
  onUploadCancel,
}: {
  form: Omit<LoadMaterialForm, "link">
  onUploadComplete: () => void
  onUploadCancel: (noWait: boolean) => void
}) {
  const [isError, setIsError] = useState(false)
  const progresRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState<number>(0)
  const abortControllerRef = useRef<AbortController>(null)
  const formData = new FormData()
  if (form.file) {
    formData.set("file", form.file)
  }
  formData.set("materialTitle", form.materialTitle)
  formData.set("contentType", form.contentType.toString())
  formData.set("token", form.token)
  formData.set("problemId", form.problemId.toString())
  formData.set("isPrimary", form.isPrimary.toString())

  const uploadFile = () => {
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    axios
      .post(PROBLEM_API + "add_material", formData, {
        onUploadProgress: (event) => {
          if (!event.progress) return
          progresRef.current?.style.setProperty("--progress-shift", `${event.progress * 100 - 100}%`)
          setProgress(event.progress * 100)
        },
        signal: abortController.signal,
      })
      .then((data) => {
        if (data.status === 200) {
          progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
          progresRef.current?.style.setProperty("--progress-color", "#00FF00")
          onUploadComplete()
        } else {
          console.error("File loaded with error")
          progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
          progresRef.current?.style.setProperty("--progress-color", "#FF0000")
          setIsError(true)
        }
      })
      .catch((error) => {
        console.error("File loaded with error", error)
        progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
        progresRef.current?.style.setProperty("--progress-color", "#FF0000")
        setIsError(true)
      })
  }

  useEffect(() => {
    uploadFile()
  }, [])

  return (
    <EmbeddingCard
      title={form.materialTitle}
      subtitle={isError ? "Ошибка" : `Загрузка: ${progress.toFixed(2)}%`}
      embeddingImageURL="/uploading.svg"
    >
      <div className="flex h-full items-center justify-center">
        {isError && (
          <MdOutlineRefresh
            className="hover:text-text-alt"
            onClick={() => {
              setIsError(false)
              uploadFile()
              progresRef.current?.style.setProperty("--progress-shift", `${-100}%`)
              progresRef.current?.style.setProperty("--progress-color", "var(--primary-accent)")
            }}
          />
        )}
        <MdOutlineClose
          className="hover:text-text-alt"
          onClick={() => {
            abortControllerRef.current?.abort()
            onUploadCancel(isError)
          }}
        />
      </div>
      <div
        className="absolute right-0 bottom-0 left-0 h-2 after:absolute after:bottom-0 after:left-(--progress-shift) after:h-2 after:w-full after:bg-(--progress-color) after:transition-all after:duration-250 after:ease-in-out after:content-['']"
        style={{ "--progress-shift": `${-100}%`, "--progress-color": "var(--primary-accent)" } as CSSProperties}
        ref={progresRef}
      ></div>
    </EmbeddingCard>
  )
}
