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
import { cookies } from "next/headers"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import { authApiServer } from "@/api/auth/serverApiInterface"
import RegistrationProviderWrapper from "@/api/registration/ClientWrapper"
import AuthProviderWrapper from "@/api/auth/ClientWrapper";

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

  let isAdmin = false
  const token = (await cookies()).get("mtiyt_auth_token")?.value
  if (token) {
    const authStore = makeAuthStoreServer()
    const authPromise = authStore.dispatch(authApiServer.endpoints.fetchPermissions.initiate({ token: token }))
    const { data: permissions, error } = await authPromise
    console.log(
      "perm",
      permissions,
      permissions?.rights.find((r) => r.right_flag === `MODERATE_TOURNAMENT_${id}`),
      `MODERATE_TOURNAMENT_${id}`,
    )
    if (permissions?.rights.find((r) => r.right_flag === `MODERATE_TOURNAMENT_${id}`) !== undefined) {
      isAdmin = true
    }
  }

  return (
    <>
      <TournamentPageStoreProviderWrapper tournament={tournament}>
        <RegistrationProviderWrapper>
          <Suspense fallback={<Loading />}>
            {tournament && (
              <div className="pt-5">
                <TournamentCard tournamentCard={tournament} isExtended={true} isCreate={false} isAdmin={isAdmin} />
              </div>
            )}
            {!tournament && <NotFound />}
            <TournamentsPageTabs tournamentCard={tournament} isAdmin={isAdmin} />
            <AuthProviderWrapper>
              <div className="bg-bg-alt mb-5 min-h-200 w-full rounded-2xl px-2 py-5">{children}</div>
            </AuthProviderWrapper>

          </Suspense>
        </RegistrationProviderWrapper>
      </TournamentPageStoreProviderWrapper>
    </>
  )
}
