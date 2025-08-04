import style from "@/styles/components/sections/problems/[id]/problemPage.module.css"
import { ProblemInterface } from "@/types/problemAPI"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { fetchEmbeddingsInfo, fetchPermissions } from "@/scripts/ApiFetchers"
import { ProblemCardContent } from "../ProblemCard"
import { ExpandableImage } from "@/components/ui/Files/ImageEmbeddings"
import { ReactNode } from "react"
import UniversalEmbedding from "@/components/ui/Files/FileEmbeddings"
import UniversalPlayer from "@/components/ui/Files/VideoEmbedding"
import PendingEmbeddingsList from "./EmbeddingAddition"
import ContentContainer from "@/components/ui/ContentContainer"

async function ProblemPage({ problem }: { problem: ProblemInterface }) {
  const userAuth = await fetchPermissions()
  let isModerator = false
  if (userAuth && userAuth.rights.length !== 0) {
    isModerator = userAuth.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + problem.tournament_type)
      .some((x) => x)
  }
  const allMaterialIds = problem.materials
  const allMaterials = await fetchEmbeddingsInfo(allMaterialIds)
  const primaryGifMaterial = allMaterials.filter((mat) => mat.content_type.type_name === "PRIMARY_GIF")
  const primaryVideoMaterial = allMaterials.find((mat) => mat.content_type.type_name === "VIDEO")
  const listOfMaterials = allMaterials.filter(
    (mat) => mat.content_type.type_name !== "PRIMARY_GIF" && mat.content_type.type_name !== "VIDEO"
  )
  return (
    <div className={style.pageRoot}>
      <div className={style.main}>
        <div className={style.problemWithGif}>
          <div className={style.problem}>
            <ProblemCardContent problem={problem} isEditable={false} />
          </div>
          {primaryGifMaterial.length > 0 && (
            <div className={style.gifContainer}>
              {primaryGifMaterial.map((gifMaterial, index) => (
                <ExpandableImage className={style.gif} src={FILES_SERVER + gifMaterial.content} key={index + 1} />
              ))}
            </div>
          )}
        </div>
        <div className={style.spacer}>
          {primaryVideoMaterial && (
            <ContentContainer containerTitle="Видео">
              <div className={style.videoContainer}>
                <UniversalPlayer embedding={primaryVideoMaterial} />
              </div>
            </ContentContainer>
          )}
          <ContentContainer containerTitle="Материалы">
            {listOfMaterials.length <= 0 && !isModerator && (
              <p className={style.nothingMessage}>У этой задачи пока нет материалов</p>
            )}
            {(listOfMaterials.length > 0 || isModerator) && (
              <div className={style.materialContainer}>
                {listOfMaterials.map((embedding) => (
                  <UniversalEmbedding key={embedding.id} embedding={embedding} />
                ))}
                {isModerator && <PendingEmbeddingsList problemId={problem.id} />}
              </div>
            )}
          </ContentContainer>
        </div>
      </div>
    </div>
  )
}

export default ProblemPage
