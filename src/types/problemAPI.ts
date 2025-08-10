import { z } from "zod"



export const ProblemTranslationSchema = z.object({
  id: z.number(),
  problem_name: z.string(),
  problem_text: z.string(),
  problem_by: z.string(),
})

export const ProblemSectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  icon_src: z.string(),
  tile_color: z.string().length(7).startsWith("#"),
  dark_theme_tile_color: z.string().length(7).startsWith("#"),
  section_science: z.number(),
  tournament_type: z.number(),
})

export const ProblemSectionWithSciencesSchema = ProblemSectionSchema.omit({section_science:true}).extend({
  section_science: z.object({
    id: z.number(),
    title: z.string(),
    color: z.string()
  })
})

export const ScienceShenma = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string(),
})

export const ProblemSchema = z.object({
  id: z.number(),
  global_number: z.number(),
  year: z.number(),
  tournament_type: z.number(),
  problem_translations: z.array(ProblemTranslationSchema),
  problem_sections: z.array(ProblemSectionSchema),
  materials: z.array(z.number()),
  sciences: z.array(ScienceShenma),
})

export type ProblemTranslationInterface = z.infer<typeof ProblemTranslationSchema>

export type ProblemSectionInterface = z.infer<typeof ProblemSectionSchema>

export type ProblemSectionWithSciencesInterface = z.infer<typeof ProblemSectionWithSciencesSchema>

export type ScienceInterface = z.infer<typeof ScienceShenma>

export type ProblemInterface = z.infer<typeof ProblemSchema>

export type ProblemListInterface = ProblemInterface[]
