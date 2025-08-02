import { z } from "zod"

export interface ProblemMaterialTypeInterface {
  id: number
  logo_path: string
  type_title: string
}
export interface ProblemMaterialInterface {
  id: number
  material_name: string
  url: string
  material_type: ProblemMaterialTypeInterface
}

export const ProblemTranslationSchema = z.object({
  id: z.number(),
  problem_name: z.string(),
  problem_text: z.string(),
  problem_by: z.string(),
})
export type ProblemTranslationInterface = z.infer<typeof ProblemTranslationSchema>

export interface ProblemInterface {
  id: number
  global_number: number
  year: number
  tournament_type: number
  problem_translations: ProblemTranslationInterface[]
  problem_materials: ProblemMaterialInterface[]
  problem_sections: ProblemSectionInterface[]
}

export const ProblemSectionschema = z.object({
  id: z.number(),
  title: z.string(),
  icon_src: z.string(),
  tile_color: z.string().length(7).startsWith("#"),
})

export type ProblemSectionInterface = z.infer<typeof ProblemSectionschema>

export type ProblemListInterface = ProblemInterface[]
