import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage/problemPage.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { Button } from "@/components/ui/Buttons"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { ProblemCardContent } from "../ProblemCard"
import { ExpandableImage } from "@/components/ui/Images"

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
        <div className={style.primaryVideoContainer}>
          <h2 className={style.videoTitle}>Видео</h2>
          <div className={style.tmpVideo}>Video here...</div>
        </div>
        <div className={style.filesContainer}>
          {isModerator && <Button>Добавить материал</Button>}
          {listOfMaterials.map((material) => {
            return (
              <div key={material.id}>
                <a href={FILES_SERVER + material.url}>
                  <img
                    src={FILES_SERVER + material.material_type.logo_path}
                    style={{ width: "10vw", height: "10vw" }}
                    alt={"pdf"}
                  />
                  <p>{material.material_name}</p>
                </a>
                {material.material_type.type_title === "pdf" && (
                  <a href={FILES_SERVER + material.url} target="_blank">
                    <Button>Скачать</Button>
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProblemPage
