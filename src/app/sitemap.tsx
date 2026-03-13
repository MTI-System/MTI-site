import { MetadataRoute } from "next"
import { PROBLEM_API, TOURNAMENTS_API } from "@/constants/APIEndpoints"
import { TournamentCardInterface } from "@/types/TournamentsAPI"
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapProblemsResponse = await fetch(PROBLEM_API + "sitemap_problems_data")
  const sitemapProblemsJson: SitemapResponse = await sitemapProblemsResponse.json()

  const sitemapTournamentsResponse = await fetch(TOURNAMENTS_API + "all_tournaments")
  const sitemapTournamentsJson: TournamentCardInterface[] = await sitemapTournamentsResponse.json()
  const resultMetadata: MetadataRoute.Sitemap = []

  sitemapProblemsJson.problems_ids.forEach((problem) => {
    resultMetadata.push({
      url: `https://mtiyt.ru/problems/${problem}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  sitemapTournamentsJson.forEach((tournament) => {
    resultMetadata.push({
      url: `https://mtiyt.ru/tournaments/${tournament.id}/info/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    })
  })

  resultMetadata.push({
    url: `https://mtiyt.ru/tournaments`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  })

  // Object.keys(sitemapJson.tt_years).forEach((tt) => {
  //   sitemapJson.tt_years[Number(tt)].forEach((year) => {
  //     resultMetadata.push({
  //       url: `https://mtiyt.ru/problems?tt=${availableTournamentTypes.find((a_tt) => a_tt.id === Number(tt))?.name}&amp;year=${year}`,
  //       lastModified: new Date(),
  //       changeFrequency: "monthly",
  //       priority: 0.9,
  //     })
  //   })
  // })

  return resultMetadata
}

interface SitemapResponse {
  problems_ids: number[]
  tt_years: Record<number, number[]>
}
