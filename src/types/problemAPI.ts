interface ProblemMaterialType {
  id: number
  logo_path: string
  type_title: string
}
interface ProblemMaterial {
  id: number
  material_name: string
  url: string
  material_type: ProblemMaterialType
}

interface ProblemTranslation {
  id: number
  problem_name: string
  problem_text: string
  problem_by: string // TODO: Rename
}

interface Problem {
  id: number
  global_number: number
  year: number
  tournament_type: number
  problem_translations: ProblemTranslation[]
  problem_materials: ProblemMaterial[]
}

type ProblemList = Problem[]

export type { ProblemMaterialType, ProblemMaterial, ProblemTranslation, Problem, ProblemList }
