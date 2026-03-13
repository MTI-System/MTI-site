import MaterialsProviderWrapper from "@/api/materials/ClientWrapper"
import AboutPage from "@/app/(main)/about/page"
import AboutTournamentPage from "@/components/tournaments/AboutPage"
import type { Metadata } from "next"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"

export async function generateMetadata({ params }: { params: Promise<{ id: number }> }): Promise<Metadata> {
  const searchP = await params

  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: searchP.id }))
  const { data: tournamentCard } = await promise
  const titleText = tournamentCard ? `Информация о турнире · ${tournamentCard.title} – МТИ` : `Турнир – МТИ`

  const descriptionText = tournamentCard
    ? `Турнир ${tournamentCard.title} ${tournamentCard.year} года: регистрируйся на научный турнир!.`
    : "Научный турнир в системе МТИ."

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

export default async function InfoTournamentPage({ params }: { params: Promise<{ id: number }> }) {
  return (
    <>
      <MaterialsProviderWrapper>
        <AboutTournamentPage />
      </MaterialsProviderWrapper>
    </>
  )
}
