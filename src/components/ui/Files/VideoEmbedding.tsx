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
import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../Buttons"
import Link from "next/link"

interface UniversalPlayerProps {
  embedding: EmbeddingInterface,
  problemId: number,
  isModerator: boolean
}

export default function UniversalPlayer({ embedding, problemId, isModerator }: UniversalPlayerProps) {
  const typeName = embedding.content_type.type_name
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(()=>{
    const el = videoRef.current
    if (!el) return
    if (el.readyState >= el.HAVE_CURRENT_DATA) {
      setIsVideoLoaded(true)
      timeoutRef.current && clearTimeout(timeoutRef.current)
    }
  }, [])



  let vidURL = ""
  let isYouTube = false
  const opts = {
    width: '100%',
    height: '100%',
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

  const [isVideoLoadingError, setIsVideoLoadingError] = useState(vidURL == "" ? true : false)
  const [errorMessage, setErrorMessage] = useState(vidURL == "" ? "Видеоплеер не поддерживается. На данный момент поддерживается только YouTube" : "")


  useEffect(()=>{
    timeoutRef.current = setTimeout(
    ()=>{
      setIsVideoLoadingError(true)
      setErrorMessage("Timeout error")
    }, 30000
  )
  }, [])

  useEffect(
    ()=>{
        if(isVideoLoadingError){
          timeoutRef.current && clearTimeout(timeoutRef.current)
        }
    }, [isVideoLoadingError]
  )

  return (
    <>    
      <div className={style.videoContainer}
          style={{ opacity: isPending ? 0.5 : 1 }}
      >
         (
          <>
            {isModerator && <MdOutlineClose className={styleDelete.deleteIcons} style={{
            position:"absolute",
            margin: "0.5rem"
              }} onClick={
                  (e)=>{
                    e.stopPropagation()
                    e.preventDefault()
                    setIsDeleteDialogOpen(true)
                  }
                }/>}
            {(!isVideoLoaded) &&
              (<div className={style.videoPlaceholderContainer}>
                {isYouTube  && !isVideoLoadingError && (
                  <>
                    <h1>Видео загружается</h1>
                    <p className={style.videoPlaceholderDescription}>Проблемы с загрузкой?</p>
                    <Link
                    href={"https://youtube.com/watch?v=" + vidURL}
                    target="_blank">
                      <Button className={style.youtubePlaceholderButton}>Смотрите видео на YouTube!</Button>
                    </Link>
                  </>
                )}
                {isYouTube  && isVideoLoadingError && (
                  <>
                    <h1>Ошибка при загрузке видео</h1>
                    <p className={style.videoPlaceholderDescription}>Причина: {errorMessage}</p>
                    <Link
                    href={"https://youtube.com/watch?v=" + vidURL}
                    target="_blank">
                      <Button className={style.youtubePlaceholderButton}>Открыть ссылку</Button>
                    </Link>
                  </>
                )}
                {!isYouTube && !isVideoLoadingError && <h1>Видео загружается, подождите, пожалуйста</h1>}
                {!isYouTube && isVideoLoadingError && (
                <>
                  <h1>Ошибка при загрузке видео</h1>
                  <Link
                    href={vidURL}
                    target="_blank">
                      <Button style={{padding: "1rem"}}>Скачать</Button>
                    </Link>
                </>
              )}
              </div>)
            }
            {isYouTube && !isVideoLoadingError && <div style={{width: "100%", height: "100%"}} hidden={!isVideoLoaded}>
              <YouTube className={style.videoPlayerStyle} 
              videoId={vidURL} opts={opts} 
                onError={
                  (e)=>{
                  }
                }
               onReady={()=>setIsVideoLoaded(true)}/>
                </div>}
            {!isYouTube && <video ref={videoRef}
            onError={(e)=>{
              setIsVideoLoadingError(true)
            }} src={vidURL} controls 
            onCanPlay={()=>{
              setIsVideoLoaded(true)
              timeoutRef.current && clearTimeout(timeoutRef.current)
            }}/>}
          </>
        )
      {/* <Button onClick={
        ()=>router.refresh()
      }>Reload</Button> */}
      </div>
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
