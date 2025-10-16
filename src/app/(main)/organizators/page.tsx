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
import { TournamentState } from "@/types/TournamentStateType"
import { TournamentsStoreProvider } from "@/components/Redux/tournamentsStoreContext"
import TournamentListPage from "@/components/tournaments/TournamentListPage"

export default async function OrganizationsMainPage({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string; page: string; state: TournamentState }>
}) {
  const sp = await searchParams
  let isNoRefresh = false
  if (!sp.page) {
    isNoRefresh = true
    sp.page = "1"
  }
  if (!sp.state) {
    isNoRefresh = true
    sp.state = "all"
  }
  if (!sp.year) {
    isNoRefresh = true
    sp.year = "2026"
  }
  if (!sp.tt) {
    isNoRefresh = true
    sp.tt = (await cookies()).get("mtiyt_tournamentType")?.value ?? "1"
  }

  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const store = makeAuthStoreServer()
  const promise = store.dispatch(
    authApiServer.endpoints.fetchPermissions.initiate({
      token: token,
    }),
  )
  const { data: userAuth, error } = await promise

  if (!userAuth) {
    redirect("/login")
  }
  const tournamentsStore = makeTournamentsStoreServer()
  const { data: possibleYears } = await tournamentsStore.dispatch(
    tournamentsApiServer.endpoints.getAvailableYears.initiate({ tt: Number(sp.tt) }),
  )
  const { data: possibleStates } = await tournamentsStore.dispatch(
    tournamentsApiServer.endpoints.getAvailableStates.initiate({ tt: Number(sp.tt), year: Number(sp.year) }),
  )

  
  const tournametnsPromise = tournamentsStore.dispatch(
    tournamentsApiServer.endpoints.getOrganizatorTournaments.initiate({
      tt: Number(sp.tt),
      year: Number(sp.year),
      token: token,
    }),
  )
  const { data: tournamentsCards } = await tournametnsPromise


  return (
    <>

        <TournamentListPage 
            rights={userAuth.rights} 
            tournamentsCards={tournamentsCards} 
            isOrganizator={true} 
            sp={sp} 
            isNoRefresh={isNoRefresh}
            />

    </>
  )
}
