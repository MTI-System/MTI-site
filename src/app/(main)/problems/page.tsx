import ProblemFilters from "@/components/problems/ProblemsFilter"
import ProblemsList from "@/components/problems/ProblemsList"
import { Suspense } from "react"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { fetchPermissions, fetchTournamentsCard, fetchTournamentTypes, fetchYears } from "@/scripts/ApiFetchers"
import SearchParamsUpdator from "@/components/problems/SearchParamsUpdator"
import type { Metadata } from "next"
import Loading from "@/app/loading"
import { ProblemInterface, ProblemSectionInterface } from "@/types/problemAPI"
import ShareButton from "@/components/problems/ShareButton"
import TournamentCard from "@/components/tournaments/TournamentCard"
import { cookies } from "next/headers"
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider"
import { Instinct } from "@/components/Instinct"
import {makeProblemsStoreServer} from "@/api/problems/serverStore";
import {problemsApiServer} from "@/api/problems/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string }>
}): Promise<Metadata> {
  const searchP = await searchParams
  const tt = Array.isArray(searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME])
    ? searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME][0]
    : searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME]

  const ttype = (await fetchTournamentTypes()).find((t) => t.name === tt)

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

//

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ year: string; tt: string; sections: string; tournament?: string }>
}) {
  let sp = await searchParams
  const currentTournament = sp.tournament ? await fetchTournamentsCard(Number(sp.tournament)) : null
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
  console.log("Updated sp", year, tt, (await cookies()).get("mtiyt_tournamentType")?.value)
  //     return (
  //       <>
  //         <ProblemsReduxProviderWrapper>
  //           <Suspense fallback={<></>}>
  //             <SearchParamsUpdator searchParams={sp} />
  //           </Suspense>
  //           <Loading />
  //         </ProblemsReduxProviderWrapper>
  //       </>
  //     )
  //   }
  const possibleYears = await fetchYears(Number(tt))
  let isUndefYear = false
  const sectionsFilter: number[] | null =
    sp.sections
      ?.split(",")
      .filter((val) => val !== "")
      .map((sectionId) => Number(sectionId)) ?? null
  if (!possibleYears.find((y) => Number(y) === Number(year))) {
    isUndefYear = true
  }
  const userAuth = await fetchPermissions()
  let isEditable = false
  if (userAuth && userAuth.rights.length !== 0) {
    isEditable = userAuth.rights.map((right) => right.right_flag == "MODERATE_PROBLEMS_" + tt).some((x) => x)
  }
  // const problems: ProblemListInterface | null = tt ? await fetchProblems(tt, Number(year)) : null

  //   const promise = dispatch(problemsApi.endpoints.getProblems.initiate({ tournament: tt, year: Number(year) }))
  //   const { data, isLoading, isSuccess /*...*/ } = await promise

  const store = makeProblemsStoreServer()
  const promise = store.dispatch(
      problemsApiServer.endpoints.getProblems.initiate(
          { tournament: tt, year: Number(year) },
          { subscribe: false, forceRefetch: true }
      )
  )
  const { data: problems, isLoading,  isError, error} = await promise
  console.log("end request", problems, isError, error)

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
      <Instinct.Container>
        <Instinct.Interactivity>
          <SearchParamsUpdator searchParams={sp} isNoRefresh={isNoRefresh} />

          <ProblemFilters
            possibleSections={availableProblemSections}
            possibleYears={possibleYears}
            isModerator={isEditable}
          ></ProblemFilters>
        </Instinct.Interactivity>
        <div className="relative h-full w-full pt-10">
          <Instinct.Content
            LoadingElement={
              <Instinct.AnimatedDiv
                className="absolute inset-0 flex items-center justify-center"
                enterAnimation={{
                  translateY: ["2rem", 0],
                  opacity: [0, 1],
                  duration: 300,
                  easing: "easeInOutQuad",
                }}
                exitAnimation={{
                  translateY: [0, "2rem"],
                  opacity: [1, 0],
                  duration: 300,
                  easing: "easeInOutQuad",
                }}
              >
                <Loading />
              </Instinct.AnimatedDiv>
            }
          >
            <Instinct.AnimatedDiv
              enterAnimation={{
                translateY: ["2rem", 0],
                opacity: [0, 1],
                duration: 300,
                easing: "easeInOutQuad",
              }}
              exitAnimation={{
                translateY: [0, "2rem"],
                opacity: [1, 0],
                duration: 300,
                easing: "easeInOutQuad",
              }}
            >
              {tt && (
                <>
                  {isUndefYear && <p>На {sp.year} год не найдено опубликованных задач</p>}
                  {!isUndefYear && (
                    <div className="mt-5 flex gap-5">
                      <div>
                        <ProblemsList
                          sectionsFilter={sectionsFilter ?? []}
                          problems={problems ?? null}
                          isEditable={isEditable}
                        />
                      </div>
                      {currentTournament !== null && (
                        <div className="aspect-[8/9] h-[37rem]">
                          <div className="fixed">
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
                </>
              )}
            </Instinct.AnimatedDiv>
          </Instinct.Content>
        </div>
      </Instinct.Container>
    </ProblemsReduxProviderWrapper>
  )
}
