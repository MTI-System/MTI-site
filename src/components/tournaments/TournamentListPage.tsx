import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface";
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore";
import { TournamentState } from "@/types/TournamentStateType";
import { cookies } from "next/headers";
import TournamentsStoreProvider from "@/components/Redux/TournamentsReduxProvider"
import TournamentsSearchParams from "./TournamentsSearchParams";
import { Suspense } from "react";
import TournamentCardsSpinner from "./TournamentCardsSpinner";
import TournamentsFilters from "./TournamentsFilters";
import Loading from "@/app/loading";
import { TournamentCardInterface } from "@/types/TournamentsAPI";
import { Right } from "@/types/authApi";

export default async function TournamentListPage({
  sp,
  tournamentsCards,
  isOrganizator,
  rights,
  isNoRefresh
}: {
  sp: { year: string; tt: string; page: string; state: TournamentState },
  tournamentsCards: TournamentCardInterface[] | null | undefined,
  isOrganizator: boolean,
  rights?: Right[] | undefined,
  isNoRefresh: boolean
}) {
  let tt = sp.tt ?? undefined
  let year = sp.year
  let page = sp.page
  let state = sp.state


  const store = makeTournamentsStoreServer()


  const { data: possibleYears } = await store.dispatch(
    tournamentsApiServer.endpoints.getAvailableYears.initiate({ tt: Number(tt) }),
  )
  const { data: possibleStates } = await store.dispatch(
    tournamentsApiServer.endpoints.getAvailableStates.initiate({ tt: Number(tt), year: Number(year) }),
  )

  const filteredTournaments =
    state === "all" ? tournamentsCards : tournamentsCards?.filter((t) => t.tournament_status === state)
  console.log("filteredTournaments", filteredTournaments)
  return (
    <TournamentsStoreProvider>
      <TournamentsSearchParams searchParams={sp} isNoRefresh={isNoRefresh} />
      <div className="h-[70vh] shrink-0">
        <TournamentsFilters availableStates={possibleStates ?? []} availableYears={possibleYears ?? []}>
          {filteredTournaments && (
            <Suspense fallback={<Loading />}>
              <TournamentCardsSpinner
                tournamentsCards={filteredTournaments}
                isModerating={isOrganizator}
                currentPage={Number(page)}
                rights={rights}
              />
            </Suspense>
          )}
        </TournamentsFilters>
      </div>
    </TournamentsStoreProvider>
  )
}
