"use client"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { LoadFileForm } from "@/types/embeddings"
import axios from "axios"
import { MdOutlineClose, MdOutlineRefresh } from "react-icons/md"
import style from "@/styles/components/ui/Files/LoadingEmbeddings/LoadingImageEmbedding.module.css"
import { useEffect, useRef, useState } from "react"

export default function LoadingImageEmbedding({
  form,
  onUploadComplete,
  onUploadCancel,
}: {
  form: Omit<LoadFileForm, "link">
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
          console.log(event.progress)
          progresRef.current?.style.setProperty("--progress-shift", `${event.progress * 100 - 100}%`)
          setProgress(event.progress * 100)
        },
        signal: abortController.signal,
      })
      .then((data) => {
        if (data.status === 200) {
          console.log("File loaded succesfull")
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
        if (error.code === "ERR_CANCELED") return
        setIsError(true)
      })
  }

  useEffect(() => {
    uploadFile()
  }, [])

  return (
    <div className={style.imgEmbeddingContainer}>
      <div className={style.iconButtons}>
        {isError && (
          <MdOutlineRefresh
            className={style.retryIcon}
            onClick={() => {
              setIsError(false)
              uploadFile()
              progresRef.current?.style.setProperty("--progress-shift", `${-100}%`)
              progresRef.current?.style.setProperty("--progress-color", "#var(--primary-accent)")
            }}
          />
        )}
        <MdOutlineClose
          className={style.abortIcon}
          onClick={() => {
            abortControllerRef.current?.abort()
            onUploadCancel(isError)
          }}
        />
      </div>
      <p className={style.progressText}>{`Загрузка: ${progress.toFixed(2)}%`}</p>
      <div className={style.loadingWrapper} ref={progresRef}></div>
    </div>
  )
}
