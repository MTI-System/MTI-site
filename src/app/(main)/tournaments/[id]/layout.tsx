import TournamentCard from "@/components/tournaments/TournamentCard"
import NotFound from "@/components/service/NotFound"
import { redirect } from "next/navigation"
import TournamentsPageTabs from "@/components/tournamentPage/TournamentsPageTabs"
import { ReactNode, Suspense } from "react"
import Loading from "@/app/loading"
import ResultsTable from "@/components/tournamentPage/ResutsTable"
import TournamentPageStoreProviderWrapper from "@/components/Redux/TournamentPageStoreProvider"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"

export default async function TournamentPage({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: ReactNode
}) {
  const id = (await params).id
  // const tournamentPageTab = reqParams[1]

  const tournamentId = Number(id)
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: tournamentId }))
  const { data: tournament, error } = await promise

  if (!tournament) {
    return <>Error</>
  }

  return (
    <>
      <TournamentPageStoreProviderWrapper tournament={tournament}>
        <Suspense fallback={<Loading />}>
          {tournament && (
            <div className="pt-5">
              <TournamentCard tournamentCard={tournament} isExtended={true} isCreate={false} />
            </div>
          )}
          {!tournament && <NotFound />}
          <TournamentsPageTabs tournamentCard={tournament} />
          <div className="bg-bg-alt mb-5 min-h-[50rem] w-full rounded-2xl px-2 py-5">{children}</div>
        </Suspense>
      </TournamentPageStoreProviderWrapper>
    </>
  )
}
