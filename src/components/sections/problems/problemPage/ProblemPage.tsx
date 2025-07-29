import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage/problemPage.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { Button } from "@/components/ui/Buttons"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { ProblemCardContent } from "../ProblemCard"
import { ExpandableImage } from "@/components/ui/Images"
import { ReactNode } from "react"
import UniversalEmbedding from "@/components/ui/FileEmbeddings"

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
  console.log(listOfMaterials)
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
                  // <div key={material.id}>
                  //   <a href={FILES_SERVER + material.url}>
                  //     <img
                  //       src={FILES_SERVER + material.material_type.logo_path}
                  //       style={{ width: "10vw", height: "10vw" }}
                  //       alt={"pdf"}
                  //     />
                  //     <p>{material.material_name}</p>
                  //   </a>
                  //   {material.material_type.type_title === "pdf" && (
                  //     <a href={FILES_SERVER + material.url} target="_blank">
                  //       <Button>Скачать</Button>
                  //     </a>
                  //   )}
                  // </div>
                )
              })}
            </div>
          )}
        </ContentContainer>
        <div className={style.filesContainer}>{isModerator && <Button>Добавить материал</Button>}</div>
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
