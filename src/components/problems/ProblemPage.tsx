import style from "@/styles/components/sections/problems/[id]/problemPage.module.css"
import { ProblemInterface } from "@/types/problemAPI"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { ProblemCardContent } from "./ProblemCard"
import { ExpandableImage } from "@/components/materials/ImageEmbeddings"
import { ReactNode } from "react"
import UniversalEmbedding from "@/components/materials/UniversalEmbedding"
import UniversalPlayer from "@/components/materials/VideoEmbedding"
import PendingEmbeddingsList from "../materials/EmbeddingAddition"
import ContentContainer from "@/components/ui/ContentContainer"
import { Button } from "@/components/ui/Buttons"
import LoadingImageEmbedding from "@/components/materials/LoadingEmbeddings/LoadingImageEmbedding"
import LoadingFileEmbedding from "@/components/materials/LoadingEmbeddings/LoadingFileEmbedding"
import { MdOutlineClose } from "react-icons/md"
import { RiFileAddLine } from "react-icons/ri"
import { BiImageAdd } from "react-icons/bi"
import { AiOutlineVideoCameraAdd } from "react-icons/ai"
import ProblemTTUpdator from "../Redux/ProblemTTUpdator"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { problemsApiServer } from "@/api/problems/serverApiInterface"
import { makeProblemsStoreServer } from "@/api/problems/serverStore"
import { makeMaterialsStoreServer } from "@/api/materials/serverStore"
import { materialsApiServer } from "@/api/materials/serverApiInterface"

async function ProblemPage({ problem }: { problem: ProblemInterface }) {
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const authStore = makeAuthStoreServer()
  const authPromise = authStore.dispatch(
    authApiServer.endpoints.fetchPermissions.initiate({
      token: token,
    }),
  )
  const { data: userAuth, error: authError } = await authPromise

  let isModerator = false
  if (userAuth && userAuth.rights.length !== 0) {
    isModerator = userAuth.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + problem.tournament_type)
      .some((x) => x)
  }
  const allMaterialIds = problem.materials

  const store = makeMaterialsStoreServer()
  const promise = store.dispatch(materialsApiServer.endpoints.getMaterialList.initiate({ ids: allMaterialIds }))
  const { data: allMaterials } = await promise
  if (!allMaterials) {
    return <></>
  }
  const primaryGifMaterial = allMaterials.filter(
    (mat) => mat.content_type.type_name === "Picture" && mat.metadata.is_primary === "true",
  )
  const primaryVideoMaterial = allMaterials.filter(
    (mat) => mat.content_type.type_name === "Video" && mat.metadata.is_primary === "true",
  )
  const listOfMaterials = allMaterials.filter((mat) => mat.metadata.is_primary !== "true")

  return (
    <div className="py-5 w-full">
      <div className="bg-bg-alt rounded-2xl pt-5 w-full">
        <ProblemTTUpdator newTT={problem.tournament_type ?? 1} />
        <div className="w-full">
          <div className="w-full px-7">
            <div className="">
              <ProblemCardContent problem={problem} isEditable={false} />
            </div>
            {(primaryGifMaterial.length > 0 || isModerator) && (
              <div  className="flex h-full w-full pb-2 sm:overflow-auto">
                <div className="flex flex-col w-full gap-2 sm:flex-row sm:h-65 sm:w-fit">
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
                      gifMaterial.metadata.is_external == "false"
                        ? FILES_SERVER + gifMaterial.content
                        : gifMaterial.content
                    return (
                      <ExpandableImage
                        isModerator={isModerator}
                        className=""
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
          <div className="flex flex-col gap-4 px-7 py-5">
            {(primaryVideoMaterial.length > 0 || isModerator) && (
              <ContentContainer containerTitle="Видео">
                <div className="flex h-full w-full pb-2 sm:overflow-auto">
                  <div className="flex flex-col w-full gap-2 sm:flex-row sm:h-100 sm:w-fit">
                    {primaryVideoMaterial.map((primaryVideoMaterial) => {
                      return (
                        <UniversalPlayer
                          key={primaryVideoMaterial.id}
                          embedding={primaryVideoMaterial}
                          problemId={problem.id}
                          isModerator={isModerator}
                        />
                      )
                    })}
                    {!primaryVideoMaterial && (
                      <div className={style.addingVideoContainer}>
                        <PendingEmbeddingsList
                          problemId={problem.id}
                          LoadingFileEmbedding={LoadingFileEmbedding}
                          buttonIcon={<AiOutlineVideoCameraAdd className={style.addImgButton} />}
                          buttonClassName={style.video}
                          isPrimary={true}
                          lockedContentTypes={["Video"]}
                          onlyOneUpload
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ContentContainer>
            )}
            {/* <div className={style.spacer}/> */}
            <ContentContainer containerTitle="Материалы">
              {listOfMaterials.length <= 0 && !isModerator && (
                <p className={style.nothingMessage}>У этой задачи пока нет материалов</p>
              )}
              {(listOfMaterials.length > 0 || isModerator) && (
                <div className="flex gap-2.5 flex-col">
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
    </div>
  )
}

export default ProblemPage
