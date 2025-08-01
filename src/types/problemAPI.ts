import { z } from "zod"

export interface ProblemMaterialType {
  id: number
  logo_path: string
  type_title: string
}
export interface ProblemMaterial {
  id: number
  material_name: string
  url: string
  material_type: ProblemMaterialType
}

export const ProblemTranslationSchema = z.object({
  id: z.number(),
  problem_name: z.string(),
  problem_text: z.string(),
  problem_by: z.string(),
})
export type ProblemTranslation = z.infer<typeof ProblemTranslationSchema>

export interface Problem {
  id: number
  global_number: number
  year: number
  tournament_type: number
  problem_translations: ProblemTranslation[]
  problem_materials: ProblemMaterial[]
  problem_sections: ProblemSection[]
}

export const ProblemSectionschema = z.object({
  id: z.number(),
  title: z.string(),
  icon_src: z.string(),
  tile_color: z.string().length(7).startsWith("#"),
})

export type ProblemSection = z.infer<typeof ProblemSectionschema>

export type ProblemList = Problem[]
