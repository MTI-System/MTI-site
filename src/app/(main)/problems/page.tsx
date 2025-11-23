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
      <section className="relative isolate">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-2 pb-12 pt-6 sm:px-4 lg:px-0">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-bg-main-accent shadow-lg shadow-black/5">
            <div className="relative p-4 sm:p-6 lg:p-8">
              <ProblemFilters
                possibleSections={availableProblemSections}
                possibleYears={possibleYears ?? [2026]}
                isModerator={isEditable}
                possibleTournaments={possibleTournaments}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  {isUndefYear && (
                    <p className="text-text-alt rounded-2xl bg-bg-alt p-4 text-center text-base">
                      На {sp.year} год не найдено опубликованных задач
                    </p>
                  )}
                  {!isUndefYear && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-bg-alt/70 p-4 shadow-sm backdrop-blur-sm sm:p-6">
                        <ProblemsList
                          sectionsFilter={sectionsFilter ?? []}
                          problems={problems ?? null}
                          isEditable={isEditable}
                        />
                      </div>
                      {currentTournament !== null && (
                        <div className="space-y-4 lg:sticky lg:top-6">
                          <div className="border-border block h-px w-full border-b lg:hidden" />
                          <div className="rounded-2xl border border-border bg-bg-alt shadow-sm">
                            <TournamentCard
                              tournamentCard={currentTournament}
                              isExtended={false}
                              isCreate={false}
                              onUpdateCreate={null}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Suspense>
              </ProblemFilters>
            </div>
          </div>
        </div>
      </section>
    </ProblemsReduxProviderWrapper>
  )
}
