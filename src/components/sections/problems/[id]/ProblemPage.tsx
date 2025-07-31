import style from "@/styles/components/sections/problems/[id]/problemPage.module.css"
import { Problem } from "@/types/problemAPI"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { Button } from "@/components/ui/Buttons"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { ProblemCardContent } from "../ProblemCard"
import { ExpandableImage } from "@/components/ui/Files/ImageEmbeddings"
import { ReactNode } from "react"
import UniversalEmbedding from "@/components/ui/Files/FileEmbeddings"
import { RiFileAddLine } from "react-icons/ri"

async function ProblemPage({ problem }: { problem: Problem }) {
  const userAuth = await fetchPermissions()
  let isModerator = false
  if (userAuth && userAuth.rights.length !== 0) {
    isModerator = userAuth.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + problem.tournament_type)
      .some((x) => x)
  }
  const allMaterials = problem.problem_materials
  const primaryGifMaterial = allMaterials.filter((mat) => mat.material_type.type_title === "PRIMARY_GIF")
  const primaryVideoMaterial = allMaterials.find((mat) => mat.material_type.type_title === "video")
  const listOfMaterials = allMaterials.filter(
    (mat) => mat.material_type.type_title !== "PRIMARY_GIF" && mat.material_type.type_title !== "video"
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
                <ExpandableImage className={style.gif} src={FILES_SERVER + gifMaterial.url} key={index + 1} />
              ))}
            </div>
          )}
        </div>
        <ContentContainer containerTitle="Видео">
          <div className={style.tmpVideo}>Video here...</div>
        </ContentContainer>
        <ContentContainer containerTitle="Материалы">
          {listOfMaterials.length <= 0 && <p className={style.nothingMessage}>У этой задачи пока нет материалов</p>}
          {listOfMaterials.length > 0 && (
            <div className={style.materialContainer}>
              {listOfMaterials.map((material) => {
                return (
                  <UniversalEmbedding
                    key={material.id}
                    embeddingImageURL={material.material_type.logo_path}
                    embeddingName={material.material_name}
                    extension="PDF"
                    extensionColor="red"
                  />
                )
              })}
              {isModerator && (
                <Button className={style.addMaterialButton}>
                  <RiFileAddLine className={style.addIcon} />
                  <h4 className={style.addTitle}>Добавить материал</h4>
                </Button>
              )}
            </div>
          )}
        </ContentContainer>
      </div>
    </div>
  )
}

function ContentContainer({ children, containerTitle }: { children: ReactNode; containerTitle: string }) {
  return (
    <div className={style.contentContainer}>
      <h2 className={style.containerTitle}>{containerTitle}</h2>
      {children}{" "}
    </div>
  )
}

export default ProblemPage
