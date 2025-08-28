import { MetadataRoute } from "next"
import { GATEWAY_API, PROBLEM_API } from "@/constants/APIEndpoints"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapResponse = await fetch(PROBLEM_API + "sitemap_problems_data")
  const sitemapJson: SitemapResponse = await sitemapResponse.json()
  const resultMetadata: MetadataRoute.Sitemap = []

  sitemapJson.problems_ids.forEach((problem) => {
    resultMetadata.push({
      url: `https://mtiyt.ru/problems/${problem}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  Object.keys(sitemapJson.tt_years).forEach((tt) => {
    sitemapJson.tt_years[Number(tt)].forEach((year) => {
      resultMetadata.push({
        url: `https://mtiyt.ru/problems?tt=${availableTournamentTypes.find((a_tt) => a_tt.id === Number(tt))?.name}&amp;year=${year}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      })
    })
  })

  return resultMetadata
}

interface SitemapResponse {
  problems_ids: number[]
  tt_years: Record<number, number[]>
}
