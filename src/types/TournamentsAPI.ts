import { z } from "zod"

export const FightContainerCard = z.object({
  id: z.number(),
  title: z.string(),
})

export const TournamentCard = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  main_image: z.string(),
  tournament_logo: z.string(),
  year: z.number(),
  tournament_status: z.string(),
  fight_containers_cards: z.array(FightContainerCard),
  materials: z.array(z.number()),
  location: z.string(),
  start_date_timestamp: z.number(),
  end_date_timestamp: z.number()
})



export const TournamentScoreEntity = z.object({
  fight_container_id: z.number(),
  fight_container_name: z.string(),
  score: z.number(),
})

export const TournamentResultsTableLine = z.object({
  team_id: z.number(),
  team_name: z.string(),
  is_unknown_team: z.boolean(),
  scores: z.array(TournamentScoreEntity),
  resultScore: z.number(),
})

export const TournamentResultsTableEntity = z.object({
  table_lines: z.array(TournamentResultsTableLine),
})

export const TournamentCreationRequestSchema = z.object({
  token: z.string().min(1),
  title: z.string().min(1, "Название турнира не может быть пустым"),
  description: z.string().min(1, "Описание турнира не может быть пустым"),
  main_image: z.string(),
  tournament_logo: z.string(),
  start_timestamp: z.number().min(1, "Необходимо выбрать даты проведения турнира"),
  end_timestamp: z.number().min(1, "Необходимо выбрать даты проведения турнира"),
  year: z.number().min(1, "Необходимо выбрать даты проведения турнира"),
  location: z.string().min(1, "Место проведения турнира не может быть пустым"),
  location_lat: z.number().optional(),
  location_lon: z.number().optional(),
  tournament_type: z.number(),
  problems: z.array(z.number()).min(1, "Необходимо выбрать хотя бы одну задачу"),
  fight_containers: z.array(z.object({
    title: z.string().min(1, "Название контейнера не может быть пустым"),
    date_timestamp: z.number(),
  })),
  materials: z.array(z.object({
    title: z.string().min(1, "Название материала не может быть пустым"),
    content: z.string().min(1, "Содержание материала не может быть пустым"),
    content_type: z.number(),
    is_external: z.boolean(),
    file_size: z.string().optional(),
  })),
})

export type TournamentCreationRequest = z.infer<typeof TournamentCreationRequestSchema>

// export interface TournamentCreationRequest {
//   token: string
//   title: string
//   description: string
//   main_image: string
//   tournament_logo: string
//   start_timestamp: number
//   end_timestamp: number
//   year: number
//   location: string
//   location_lat: number
//   location_lon: number
//   tournament_type: number
//   problems: number[]
//   fight_containers: TournamentContainerRequest[]
//   materials: TournamentMaterials[]
// }

// interface TournamentContainerRequest{
//   title: string
//   date_timestamp: number
// }

// interface TournamentMaterials{
//   title: string
//   content: string
//   content_type: number
//   is_external: boolean
//   file_size: string | null
// }



export type TournamentResultsTableEntity = z.infer<typeof TournamentResultsTableEntity>
export type TournamentCardInterface = z.infer<typeof TournamentCard>