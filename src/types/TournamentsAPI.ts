import {z} from "zod"
import TeamInTournamentPage from "@/components/tournaments/TeamInTournamentPage";

export const FightContainerCard = z.object({
  id: z.number(),
  title: z.string(),
})

export const TournamentLocation = z.object({
  id: z.number(),
  location_text: z.string(),
  location_lat: z.number().optional(),
  location_lon: z.number().optional(),
})

export const Badge = z.object({
  badge_color: z.string(),
  badge_title: z.string(),
  badge_flag: z.string(),
})
export const teamInTournamentSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  global_team_id: z.number().optional(),
  players: z.array(z.number()),
})
export const TournamentCard = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  main_image: z.string(),
  tournament_logo: z.string(),
  year: z.number(),
  badge: Badge,
  fight_containers_cards: z.array(FightContainerCard),
  materials: z.array(z.number()),
  location: TournamentLocation,
  start_date_timestamp: z.number(),
  end_date_timestamp: z.number(),
  tournament_type: z.number(),
  teams: z.array(teamInTournamentSchema),
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
  fight_containers: z.array(
    z.object({
      title: z.string().min(1, "Название контейнера не может быть пустым"),
      date_timestamp: z.number(),
    }),
  ),
  materials: z.array(
    z.object({
      title: z.string().min(1, "Название материала не может быть пустым"),
      content: z.string().optional(),
      content_type: z.number(),
      is_external: z.boolean(),
      file_size: z.string().optional(),
    }),
  ),
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


export const fightTeamInTournamentShema = teamInTournamentSchema.omit({global_team_id: true, players: true}).extend({
  score: z.number(),
  coefficient: z.number(),
  reported_problem: z.number().optional(),
  reporterScore: z.number().optional(),
  opponentScore: z.number().optional(),
  reviewerScore: z.number().optional(),
})

export const fightInformationSchema = z.object({
  id: z.number(),
  actions: z.array(z.number()),
  is_location_link: z.boolean(),
  location: z.string().nonempty(),
  startTime: z.number(),
  jouries: z.array(z.number()),
  teams: z.array(
    fightTeamInTournamentShema
  ),
})

export const teamRoleInActionSchema = z.object({
  id: z.number(),
  title: z.string(),
  baseCoefficient: z.number(),
})

export const teamScoreInActionSchema = z.object({
  id: z.number(),
  value: z.number(),
  jury: z.number(),
})

const callSchema = z.object({
  id: z.number(),
  problemId: z.number(),
  result: z.boolean()
})

const draftActionSchema = z.object({
  id: z.number(),
  chellenger: teamInTournamentSchema,
  chellenged: teamInTournamentSchema,
  calls: z.array(callSchema)
})

export const fightActionSchema = z.object({
  pickedProblem: z.number().optional(),
  drafts: draftActionSchema.optional().nullable(),
  playerLines: z.array(
    z.object({

      performanceId: z.number(),
      role: teamRoleInActionSchema.optional(),
      playerId: z.number().optional(),
      team: teamInTournamentSchema,
      finalScore: z.number(),
      scores: z.array(teamScoreInActionSchema),
    }),
  ),
})



export const fightContainerInfoSchema = z.array(fightInformationSchema)

export const fightInfoByTournamentSchema = z.record(z.string(), fightContainerInfoSchema)

export type FightActionInterface = z.infer<typeof fightActionSchema>
export type CallInterface = z.infer<typeof callSchema>
export type TeamRoleInActionInterface = z.infer<typeof teamRoleInActionSchema>
export type TeamScoreInActionInterface = z.infer<typeof teamScoreInActionSchema>
export type TeamInTournamentInterface = z.infer<typeof teamInTournamentSchema>
export type FightInformationInterface = z.infer<typeof fightInformationSchema>
export type FightInfoByTournamentInterface = z.infer<typeof fightInfoByTournamentSchema>
export type FightContainerInfoInterface = z.infer<typeof fightContainerInfoSchema>

export type TournamentResultsTableEntity = z.infer<typeof TournamentResultsTableEntity>
export type TournamentCardInterface = z.infer<typeof TournamentCard>
export type FightContainerCardInterface = z.infer<typeof FightContainerCard>
export type BadgeInterface = z.infer<typeof Badge>
