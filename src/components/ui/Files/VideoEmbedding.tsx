"use client"
import style from "@/styles/components/ui/Files/videoEmbedding.module.css"
import getVideoId from "get-video-id"
import YouTube from "react-youtube"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { EmbeddingInterface } from "@/types/embeddings"

interface UniversalPlayerProps {
  embedding: EmbeddingInterface
}

export default function UniversalPlayer({ embedding }: UniversalPlayerProps) {
  const typeName = embedding.content_type.type_name
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
    <div className={style.videoContainer}>
      {vidURL === "" ? (
        <p>Error occured while loading video</p>
      ) : (
        <>
          {isYouTube && <YouTube videoId={vidURL} opts={opts} />}
          {!isYouTube && <video src={vidURL} controls />}
        </>
      )}
    </div>
  )
}
