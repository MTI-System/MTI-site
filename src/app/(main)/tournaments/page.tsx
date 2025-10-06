import TournamentsFilters from "@/components/tournaments/TournamentsFilters";
import {fetchTournamentsCards, fetchTournamentTypes} from "@/scripts/ApiFetchers";
import TournamentCardsSpinner from "@/components/tournaments/TournamentCardsSpinner";
import {Suspense} from "react";
import Loading from "@/app/loading";
import TournamentsSearchParams from "@/components/tournaments/TournamentsSearchParams";
import TournamentsStoreProvider from "@/components/Redux/TournamentsReduxProvider";
import ShareButton from "@/components/problems/ShareButton";
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider";
import SearchParamsUpdator from "@/components/problems/SearchParamsUpdator";
import type {Metadata} from "next";
import {TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";


export async function generateMetadata({
                                         searchParams,
                                       }: {
  searchParams: Promise<{ year: string; tt: string; page: string }>
}): Promise<Metadata> {
  const searchP = await searchParams
  const tt = Array.isArray(searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME])
      ? searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME][0]
      : searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME]

  const ttype = (await fetchTournamentTypes()).find((t) => t.name === tt)
  const titleText = ttype ? `Турниры · ${ttype.longName} · ${searchP.year} год – МТИ` : "Турниры – МТИ"

  const descriptionText = ttype
      ? `Турниры ${ttype.longName} ${searchP.year} года: регистрируйся на научные турниры!.`
      : "Список научных турниров в системе МТИ."

  return {
    title: titleText,
    description: descriptionText,
    verification: {yandex: "aa838087dd1ef992"},
  }
}

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