import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner"
import TournamentsStoreProviderWrapper from "@/components/Redux/TournamentsReduxProvider"
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams"
import TournamentsFilters from "@/components/tournaments/TournamentsFilters"
import { Suspense } from "react"
import Loading from "@/app/loading"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"

export default async function OrganizationsMainPage({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string; page: string }>
}) {
  const sp = await searchParams
  if (!sp.year || !sp.tt || !sp.page) {
    return (
      <TournamentsStoreProviderWrapper>
        <TournamentsSearchParams searchParams={sp} />
        <TournamentsFilters />
        <div className="h-[50rem] w-full">
          <Loading />
        </div>
      </TournamentsStoreProviderWrapper>
    )
  }

  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const store = makeAuthStoreServer()
  const promise = store.dispatch(
    authApiServer.endpoints.fetchPermissions.initiate({
      token: token,
    }),
  )
  const { data: userAuth, error } = await promise

  const tournamentsStore = makeTournamentsStoreServer()
  const tournametnsPromise = store.dispatch(
    tournamentsApiServer.endpoints.getOrganizatorTournaments.initiate({
      tt: Number(sp.tt),
      year: Number(sp.year),
      token: token,
    }),
  )
  const { data: tournamentsCards } = await tournametnsPromise

  if (!userAuth) {
    redirect("/login")
  }
  return (
    <>
      <TournamentsStoreProviderWrapper>
        <TournamentsSearchParams searchParams={sp} />
        <TournamentsFilters />
        {tournamentsCards && (
          <TournamentCardsSpinner tournamentsCards={tournamentsCards} isModerating={true} rights={userAuth.rights} />
        )}
      </TournamentsStoreProviderWrapper>
    </>
  )
}
