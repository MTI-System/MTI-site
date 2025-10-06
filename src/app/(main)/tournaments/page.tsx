import TournamentsFilters from "@/components/tournaments/TournamentsFilters";
import {fetchTournamentsCards} from "@/scripts/ApiFetchers";
import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner";
import {Suspense} from "react";
import Loading from "@/app/loading";
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams";
import TournamentsStoreProvider from "@/components/Redux/TournamentsReduxProvider";
import ShareButton from "@/components/problems/ShareButton";
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider";
import SearchParamsUpdator from "@/components/problems/SearchParamsUpdator";

export default async function TournamentsPage({searchParams}: {
  searchParams: Promise<{ year: string; tt: string; page: string }>
}) {
  const sp = await searchParams


  if (!sp.year || !sp.tt || !sp.page) {
    return (
        <>
          <TournamentsStoreProvider>
            <Suspense fallback={<></>}>
              <TournamentsSearchParams searchParams={sp}/>
            </Suspense>
            <Loading/>
          </TournamentsStoreProvider>
        </>
    )
  }
  const tournamentsCards = await fetchTournamentsCards(Number(sp.tt) ?? 1, Number(sp.year))
  return (
    <>
      <TournamentsStoreProvider>
        <Suspense fallback={<h1></h1>}>
          <div className="">
            <TournamentsSearchParams searchParams={sp}/>
            <TournamentsFilters/>
            <div className="w-full h-fit flex justify-end px-3 pt-3" >
              <ShareButton/>
            </div>
            {/*<ShareButton searchParams={sp}/>*/}
            <TournamentCardsSpinner tournamentsCards={tournamentsCards} isModerating={false} />
          </div>
        </Suspense>

      </TournamentsStoreProvider>
    </>
  )
}