import z from "zod";



export const Coords = z.object({
    geo_lat: z.string(),
    geo_lon: z.string(),
})

export const Suggestion = z.object({
    data: Coords,
    unrestricted_value: z.string()
})

export const SuggestionShenma = z.object({
    suggestions: z.array(Suggestion)
})

export type SuggestionInterface = z.infer<typeof SuggestionShenma>