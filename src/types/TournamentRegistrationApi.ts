import { z } from "zod"

export const TournamentRegistrationFormFieldMetadata = z.object({
  dropdown_options: z.optional(
    z.string().transform((str) => {
      try {
        return JSON.parse(str)
      } catch {
        return {}
      }
    }),
  ),
  placeholder: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
  selectMode: z.enum(["single", "range"]).optional(),
  selectableDateRanges: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .optional(),
  accept: z.string().optional(),
})

export const TournamentRegistrationFormField = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  key: z.string(),
  metadata: TournamentRegistrationFormFieldMetadata.optional(),
})

export const TournamentRegistrationFormInfo = z.object({
  id: z.number(),
  tournament: z.number(),
  fields: z.array(TournamentRegistrationFormField).optional(),
})

export const TournamentRegistrationAnswerField = z.object({
  id: z.number(),
  formField: TournamentRegistrationFormField,
  content: z.string(),
})

export const TournamentRegistrationAnswer = z.object({
  id: z.number(),
  status: z.string(),
  fields: z.array(TournamentRegistrationAnswerField),
  respondingUser: z.number(),
  neededPd: z.array(z.number()).optional()
})


export const TournamentInformationFormResponse = z.object({
  form_id: z.number(),
  title: z.string(),
  form_type_name: z.string(),
  form_type_flag: z.string()
})

export const TournamentInformationResponse = z.object({
  available_forms: z.array(TournamentInformationFormResponse).optional()
})



export type TournamentRegistrationFormInfoInterface = z.infer<typeof TournamentRegistrationFormInfo>
export type TournamentInformationResponseInterface = z.infer<typeof TournamentInformationResponse>
export type TournamentRegistrationFormFieldInterface = z.infer<typeof TournamentRegistrationFormField>
export type TournamentRegistrationAnswerFieldInterface = z.infer<typeof TournamentRegistrationAnswerField>
export type TournamentRegistrationAnswerInterface = z.infer<typeof TournamentRegistrationAnswer>
