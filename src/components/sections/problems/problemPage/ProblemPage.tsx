import { Problem } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage.module.css"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Button from "@/components/ui/Button"
import { fetchPermissions } from "@/scripts/ApiFetchers"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

async function ProblemPage({ problem }: { problem: Problem }) {
  const userAuth = await fetchPermissions(false, "")
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
            <div className={style.problemCard}>
              <h2 className={style.problemTitle}>
                {problem.global_number}.{problem.problem_translations[0].problem_name}
              </h2>
              <h5 className={style.translation}>Translation here...</h5>
              <p className={style.problemText}>{problem.problem_translations[0].problem_text}</p>
            </div>
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
