"use client"
import style from "@/styles/components/ui/Files/videoEmbedding.module.css"
import getVideoId from "get-video-id"
import YouTube from "react-youtube"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { EmbeddingInterface } from "@/types/embeddings"
import { MdOutlineClose } from "react-icons/md"
import styleDelete from "@/styles/components/ui/Files/imageEmbeddings.module.css"
import { DeletionMaterialConfirmationModal } from "./UniversalEmbedding"
import { deleteMaterial } from "@/scripts/ApiFetchers"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

interface UniversalPlayerProps {
  embedding: EmbeddingInterface,
  problemId: number
}

export default function UniversalPlayer({ embedding, problemId }: UniversalPlayerProps) {
  const typeName = embedding.content_type.type_name
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const router = useRouter()
  let vidURL = ""
  let isYouTube = false
  const opts = {
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
      controls: 1,
    },
  }

  if (typeName === "Video" && embedding.metadata.is_external === "true" && embedding.metadata.is_primary === "true") {
    vidURL = getVideoId(embedding.content).id ?? ""
    isYouTube = true
  } else if (typeName === "Video" && embedding.metadata.is_primary === "true") {
    vidURL = FILES_SERVER + embedding.content
  }
  return (
    <>    
      <div className={style.videoContainer}
          style={{ opacity: isPending ? 0.5 : 1 }}
      >
        {vidURL === "" ? (
          <p>Error occured while loading video</p>
        ) : (
          <>
            <MdOutlineClose className={styleDelete.deleteIcons} style={{
            position:"absolute",
            margin: "0.5rem"
              }} onClick={
                  (e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    console.log("delete")
                    setIsDeleteDialogOpen(true)
                  }
                }/>
            {isYouTube && <YouTube videoId={vidURL} opts={opts} onReady={()=>console.log("Ready Youtube")}/>}
            {!isYouTube && <video src={vidURL} controls onCanPlay={()=>console.log("Ready Video")}/>}
          </>
        )}

      </div>
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
    </>
  )
}
