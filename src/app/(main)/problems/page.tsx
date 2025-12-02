import ProblemFilters from "@/components/problems/ProblemsFilter"
import ProblemsList from "@/components/problems/ProblemsList"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import SearchParamsUpdator from "@/components/problems/SearchParamsUpdator"
import type { Metadata } from "next"
import { ProblemInterface, ProblemSectionInterface } from "@/types/problemAPI"
import TournamentCard from "@/components/tournaments/TournamentCard"
import { cookies } from "next/headers"
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider"
import { makeProblemsStoreServer } from "@/api/problems/serverStore"
import { problemsApiServer } from "@/api/problems/serverApiInterface"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { TournamentCardInterface } from "@/types/TournamentsAPI"
import { Suspense } from "react"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string }>
}): Promise<Metadata> {
  const searchP = await searchParams
  const tt = Array.isArray(searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME])
    ? searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME][0]
    : searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME]
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}))
  const { data: tournamentTypes } = await promise

  const ttype = tournamentTypes?.find((t) => t.id === Number(tt))

  const titleText = ttype ? `Задачи · ${ttype.longName} · ${searchP.year} год – МТИ` : "Задачи – МТИ"

  const descriptionText = ttype
    ? `Опубликованные задачи для ${ttype.longName} ${searchP.year} года: смотри актуальные задачи для научных турниров.`
    : "Список задач научных турниров в системе МТИ."

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string; sections: string; tournament?: string }>
}) {
  let sp = await searchParams

  const getCardFromApi = async (): Promise<TournamentCardInterface | null> => {
    const store = makeTournamentsStoreServer()
    const promise = store.dispatch(
      tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: Number(sp.tournament) }),
    )
    const { data, error } = await promise
    return data ?? null
  }

  const currentTournament = sp.tournament ? await getCardFromApi() : null
  let isNoRefresh = false
  let tt = sp.tt ?? undefined
  let year = sp.year

  if (!sp.year) {
    isNoRefresh = true
    year = "2026"
  }
  if (!tt) {
    isNoRefresh = true
    tt = (await cookies()).get("mtiyt_tournamentType")?.value ?? "1"
  }

  const store = makeProblemsStoreServer()
  const { data: possibleYears } = await store.dispatch(
    problemsApiServer.endpoints.getYears.initiate({ tournamentTypeId: Number(tt) }),
  )
  let isUndefYear = false
  const sectionsFilter: number[] | null =
    sp.sections
      ?.split(",")
      .filter((val) => val !== "")
      .map((sectionId) => Number(sectionId)) ?? null
  if (!possibleYears?.find((y) => Number(y) === Number(year))) {
    isUndefYear = true
  }

  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const authStore = makeAuthStoreServer()
  const authPromise = authStore.dispatch(
    authApiServer.endpoints.fetchPermissions.initiate({
      token: token,
    }),
  )
  const { data: userAuth, error: authError } = await authPromise

  let isEditable = false
  if (userAuth && userAuth.rights.length !== 0) {
    isEditable = userAuth.rights.map((right) => right.right_flag == "MODERATE_PROBLEMS_" + tt).some((x) => x)
  }

  const promise = !sp.tournament
    ? store.dispatch(problemsApiServer.endpoints.getProblems.initiate({ tournament: tt, year: Number(year) }))
    : store.dispatch(
        problemsApiServer.endpoints.getProblemsForTournament.initiate({ tournamentId: Number(sp.tournament) }),
      )
  const { data: problems, isLoading, isError, error } = await promise
  const tournamentsStore = makeTournamentsStoreServer()
  const { data: possibleTournaments } = await tournamentsStore.dispatch(
    tournamentsApiServer.endpoints.getTournamentCards.initiate({ tt: Number(tt), year: Number(year) }),
  )

  const availableProblemSections: ProblemSectionInterface[] = []
  problems?.forEach((problem: ProblemInterface) => {
    problem.problem_sections.forEach((section) => {
      if (!availableProblemSections.find((sec) => sec.id === section.id)) {
        availableProblemSections.push(section)
      }
    })
  })
  availableProblemSections.sort(
    (section_1, section_2) =>
      section_1.section_science - section_2.section_science || section_1.title.localeCompare(section_2.title),
  )
  return (
    <ProblemsReduxProviderWrapper>
      <SearchParamsUpdator searchParams={sp} isNoRefresh={isNoRefresh} />



      <ProblemFilters
        possibleSections={availableProblemSections}
        possibleYears={possibleYears ?? [2026]}
        isModerator={isEditable}
        possibleTournaments={possibleTournaments}
      >



        <div className="relative h-full w-full pt-10">
          <Suspense fallback={<div>Loading...</div>}>
            {isUndefYear && <p>На {sp.year} год не найдено опубликованных задач</p>}
            {!isUndefYear && (
              <div className="flex flex-col-reverse gap-5 lg:flex-row">
                <div className="w-full">
                  <ProblemsList
                    sectionsFilter={sectionsFilter ?? []}
                    problems={problems ?? null}
                    isEditable={isEditable}
                  />
                </div>
                {currentTournament !== null && (
                  <>
                    <div className="border-border my-5 block h-0 w-full border-b-2 lg:hidden"></div>
                    <div className="static aspect-auto md:top-2 md:aspect-8/9 md:h-148 lg:sticky">
                      <TournamentCard
                        tournamentCard={currentTournament}
                        isExtended={false}
                        isCreate={false}
                        onUpdateCreate={null}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </Suspense>
        </div>
      </ProblemFilters>
    </ProblemsReduxProviderWrapper>
  )
}