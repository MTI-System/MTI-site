"use client"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { LoadFileForm } from "@/types/embeddings"
import { useState, useEffect } from "react"
import { EmbeddingCard } from "../FileEmbeddings"
import style from "@/styles/components/ui/Files/LoadingEmbeddings/LoadingFileEmbedding.module.css"

export default function LoadingFileEmbedding({ form }: { form: LoadFileForm }) {
  const [loadingState, setLoadingState] = useState("loading")
  const [progress, setProgress] = useState(0)

  const uploadMaterial = () => {
    var formData = new FormData()
    if (form.file) {
      formData.append("file", form.file)
    }
    if (form.link) {
      formData.append("link", form.link)
    }
    formData.append("materialTitle", form.materialTitle)
    formData.append("contentType", form.contentType.toString())
    formData.append("token", form.token)
    formData.append("problemId", form.problemId.toString())
    formData.append("isPrimary", form.isPrimary.toString())
    var xhr = new XMLHttpRequest()
    xhr.upload.addEventListener(
      "progress",
      (event) => {
        setProgress((event.loaded / event.total) * 100)
      },
      false
    )
    xhr.open("POST", PROBLEM_API + "add_material")
    xhr.send(formData)
  }

  useEffect(uploadMaterial, [])

  return (
    <>
      <EmbeddingCard title={form.materialTitle} subtitle="Uploading progress later" embeddingImageURL="/uploading.svg">
        <div className={style.loadingWrapper}></div>
      </EmbeddingCard>
    </>
  )
}
