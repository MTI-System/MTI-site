import TournamentsFilters from "@/components/tournaments/TournamentsFilters"
import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner"
import { Suspense } from "react"
import Loading from "@/app/loading"
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams"
import TournamentsStoreProvider from "@/components/Redux/TournamentsReduxProvider"
import ShareButton from "@/components/problems/ShareButton"
import type { Metadata } from "next"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import {TournamentState} from "@/types/TournamentStateType";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import {makeProblemsStoreServer} from "@/api/problems/serverStore";
import {problemsApiServer} from "@/api/problems/serverApiInterface";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string; page: string; state:TournamentState }>
}): Promise<Metadata> {
  const searchP = await searchParams
  const tt = Array.isArray(searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME])
    ? searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME][0]
    : searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME]

  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}))
  const { data: tournamentTypes } = await promise
  const ttype = tournamentTypes?.find((t) => t.id === Number(tt))
  const titleText = ttype ? `Турниры · ${ttype.longName} · ${searchP.year} год – МТИ` : "Турниры – МТИ"




  const descriptionText = ttype
    ? `Турниры ${ttype.longName} ${searchP.year} года: регистрируйся на научные турниры!.`
    : "Список научных турниров в системе МТИ."

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string; page: string; state: TournamentState }>
}) {
  const sp = await searchParams

  if (!sp.year || !sp.tt || !sp.page) {
    return (
      <>
        <TournamentsStoreProvider>
          <TournamentsProviderWrapper>
          <Suspense fallback={<></>}>
            <TournamentsSearchParams searchParams={sp} />
          </Suspense>
          <Loading />
          </TournamentsProviderWrapper>
        </TournamentsStoreProvider>
      </>
    )
  }
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(
    tournamentsApiServer.endpoints.getTournamentCards.initiate({ tt: Number(sp.tt), year: Number(sp.year) }),
  )
  const { data: tournamentsCards, error } = await promise

  const { data: possibleYears } = await store.dispatch(
      tournamentsApiServer.endpoints.getAvailableYears.initiate({ tt: Number(sp.tt) }),
  )
  const { data: possibleStates } = await store.dispatch(
      tournamentsApiServer.endpoints.getAvailableStates.initiate({ tt: Number(sp.tt), year: Number(sp.year) }),
  )


  const filteredTournaments = sp.state === "all" ? tournamentsCards : tournamentsCards?.filter(t=>t.tournament_status === sp.state)
  // const tournamentsCards = await fetchTournamentsCards(Number(sp.tt) ?? 1, Number(sp.year))
  return (
    <>
      <TournamentsStoreProvider>
        <Suspense fallback={<Loading/>}>
          <div className="h-[70vh] shrink-0">

              <TournamentsSearchParams searchParams={sp} />
              <TournamentsFilters availableStates={possibleStates ?? []} availableYears={possibleYears ?? []}/>

            {/*<ShareButton searchParams={sp}/>*/}
            {filteredTournaments && <TournamentCardsSpinner tournamentsCards={filteredTournaments} isModerating={false} />}
          </div>
        </Suspense>
      </TournamentsStoreProvider>
    </>
  )
}
