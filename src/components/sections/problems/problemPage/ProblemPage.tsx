import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage/problemPage.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { Button } from "@/components/ui/Buttons"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { ProblemCardContent } from "../ProblemCard"

async function ProblemPage({ problem }: { problem: Problem }) {
  const userAuth = await fetchPermissions()
  let isModerator = false
  if (userAuth && userAuth.rights.length !== 0) {
    isModerator = userAuth.rights
      .map((right) => right.right_flag == "MODERATE_PROBLEMS_" + problem.tournament_type)
      .some((x) => x)
  }
  const allMaterials = problem.problem_materials
  const primaryGifMaterial = allMaterials.find((mat) => mat.material_type.type_title === "primaryImg")
  const primaryVideoMaterial = allMaterials.find((mat) => mat.material_type.type_title === "video")
  const listOfMaterials = allMaterials.filter(
    (mat) => mat.material_type.type_title !== "gif" && mat.material_type.type_title !== "video"
  )

  return (
    <div className={style.pageRoot}>
      <div className={style.problemContainer}>
        <div className={style.problemWithGif}>
          <div className={style.problemWithTournamets}>
            <ProblemCardContent problem={problem} isEditable={false} />
            <div className={style.tournamentsContainer}>Tournaments here...</div>
          </div>
          <div className={style.gifContainer}>Optional GIF here...</div>
        </div>
        <div className={style.primaryVideoContainer}>
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
