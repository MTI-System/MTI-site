"use client"
import { Embedding } from "@/types/embeddings"
import style from "@/styles/components/ui/Files/videoEmbedding.module.css"
import getVideoId from "get-video-id"
import YouTube from "react-youtube"
import { FILES_SERVER } from "@/constants/APIEndpoints"

interface UniversalPlayerProps {
  embedding: Embedding
}

export default function UniversalPlayer({ embedding }: UniversalPlayerProps) {
  const typeName = embedding.material_type.type_title
  let vidURL = ""
  let isYouTube = false
  const opts = {
    playerVars: {
      autoplay: 1, // auto-play the video
      rel: 0, // disable related videos at the end
      modestbranding: 1, // remove YouTube logo
      controls: 1, // show controls
    },
  }

  if (typeName === "YOUTUBE_VIDEO") {
    vidURL = getVideoId(embedding.url).id ?? ""
    isYouTube = true
  } else if (typeName === "VIDEO") {
    vidURL = FILES_SERVER + embedding.url
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
