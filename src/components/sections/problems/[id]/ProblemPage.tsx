import style from "@/styles/components/sections/problems/[id]/problemPage.module.css"
import { ProblemInterface } from "@/types/problemAPI"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { fetchEmbeddingsInfo, fetchPermissions } from "@/scripts/ApiFetchers"
import { ProblemCardContent } from "../ProblemCard"
import { ExpandableImage } from "@/components/ui/Files/ImageEmbeddings"
import { ReactNode } from "react"
import UniversalEmbedding from "@/components/ui/Files/UniversalEmbedding"
import UniversalPlayer from "@/components/ui/Files/VideoEmbedding"
import PendingEmbeddingsList from "./EmbeddingAddition"
import ContentContainer from "@/components/ui/ContentContainer"
import { Button } from "@/components/ui/Buttons"
import LoadingImageEmbedding from "@/components/ui/Files/LoadingEmbeddings/LoadingImageEmbedding"
import LoadingFileEmbedding from "@/components/ui/Files/LoadingEmbeddings/LoadingFileEmbedding"
import { MdOutlineClose } from "react-icons/md"
import { RiFileAddLine } from "react-icons/ri"
import { BiImageAdd } from "react-icons/bi"
import { AiOutlineVideoCameraAdd } from "react-icons/ai"
import ProblemTTUpdator from "./ProblemTTUpdator"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

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
  const primaryGifMaterial = allMaterials.filter(
    (mat) => mat.content_type.type_name === "Picture" && mat.metadata.is_primary === "true"
  )
  const primaryVideoMaterial = allMaterials.find(
    (mat) => mat.content_type.type_name === "Video" && mat.metadata.is_primary === "true"
  )
  const listOfMaterials = allMaterials.filter((mat) => mat.metadata.is_primary !== "true")

  return (
    <div className={style.pageRoot}>
      <ProblemTTUpdator newTT={availableTournamentTypes.find(tt=>tt.id===problem.tournament_type)?.name??"ТЮФ"}/>
      <div className={style.main}>
        <div className={style.problemWithGif}>
          <div className={style.problem}>
            <ProblemCardContent problem={problem} isEditable={false} />
          </div>
          {(primaryGifMaterial.length > 0 || isModerator) && (
            <div className={style.scrollableContainer}>
                          <div className={style.gifContainer}>
              
                            {isModerator && (
                <PendingEmbeddingsList
                  problemId={problem.id}
                  LoadingFileEmbedding={LoadingImageEmbedding}
                  buttonIcon={<BiImageAdd />}
                  buttonClassName={style.gif}
                  isPrimary={true}
                  lockedContentTypes={["Picture"]}
                />
              )}
              {primaryGifMaterial.map((gifMaterial, index) => {
                const imageSrc =
                  gifMaterial.metadata.is_external == "false" ? FILES_SERVER + gifMaterial.content : gifMaterial.content
                return (
                  <ExpandableImage
                    isModerator={isModerator}
                    className={style.gif}
                    src={imageSrc}
                    embedding={gifMaterial}
                    problemId={problem.id}
                    key={index + 1}
                  />
                )
              })}

            </div>
            </div>

          )}
        </div>
        <div className={style.spacer}>
          {(primaryVideoMaterial || isModerator) && (
            <ContentContainer containerTitle="Видео">
              <div className={style.videoContainer}>
                {primaryVideoMaterial && <UniversalPlayer embedding={primaryVideoMaterial} problemId={problem.id} isModerator={isModerator}/>}
                {!primaryVideoMaterial && (
                  <div className={style.addingVideoContainer}>
                    <PendingEmbeddingsList
                      problemId={problem.id}
                      LoadingFileEmbedding={LoadingFileEmbedding}
                      buttonIcon={<AiOutlineVideoCameraAdd className={style.addImgButton}/>}
                      buttonClassName={style.video}
                      isPrimary={true}
                      lockedContentTypes={["Video"]}
                      onlyOneUpload
                    />
                  </div>
                )}
              </div>
            </ContentContainer>
          )}
          {/* <div className={style.spacer}/> */}
          <ContentContainer containerTitle="Материалы">
            {listOfMaterials.length <= 0 && !isModerator && (
              <p className={style.nothingMessage}>У этой задачи пока нет материалов</p>
            )}
            {(listOfMaterials.length > 0 || isModerator) && (
              <div className={style.materialContainer}>
                {listOfMaterials.map((embedding) => (
                  <UniversalEmbedding
                    isModerator={isModerator}
                    key={embedding.id}
                    embedding={embedding}
                    problemId={problem.id}
                  />
                ))}
                {isModerator && (
                  <PendingEmbeddingsList
                    problemId={problem.id}
                    LoadingFileEmbedding={LoadingFileEmbedding}
                    buttonClassName={style.addMaterialButton}
                    buttonIcon={<RiFileAddLine className={style.addIcon} />}
                  />
                )}
              </div>
            )}
          </ContentContainer>
        </div>
      </div>
    </div>
  )
}

export default ProblemPage
