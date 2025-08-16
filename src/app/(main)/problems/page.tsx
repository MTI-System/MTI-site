import style from "@/styles/routes/(main)/problems/page.module.css"
import ProblemFilters from "@/components/problems/ProblemsFilter"
import ProblemsList from "@/components/problems/ProblemsList"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { Suspense } from "react"
import { TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import { fetchPermissions, fetchProblems, fetchYears } from "@/scripts/ApiFetchers"
import SearchParamsUpdator from "@/components/Redux/SearchParamsUpdator"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import Loading from "@/app/loading"
import { ProblemListInterface, ProblemSectionInterface } from "@/types/problemAPI"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ year: number; tt: string }>
}): Promise<Metadata> {
  const searchP = await searchParams
  const tt = Array.isArray(searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME])
    ? searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME][0]
    : searchP[TOURNAMENT_TYPE_SEARCH_PARAM_NAME]

  const ttype = availableTournamentTypes.find((t) => t.name === tt)

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
  searchParams: Promise<{ year: string; tt: string; sections: string | null }>
}) {
  const sp = await searchParams
  if (!sp.year || !sp.tt) {
    return (
      <>
        <Suspense fallback={<></>}>
          <SearchParamsUpdator />
        </Suspense>
        <Loading />
      </>
    )
  }
  let tt = sp.tt ?? undefined
  const possibleYears = await fetchYears(availableTournamentTypes.find((val) => val.name === tt)?.id ?? 1)
  let isUndefYear = false
  const year = sp.year
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
    isEditable = userAuth.rights
      .map(
        (right) =>
          right.right_flag == "MODERATE_PROBLEMS_" + availableTournamentTypes.find((val) => val.name === tt)?.id
      )
      .some((x) => x)
  }
  const ttid = availableTournamentTypes.find((value) => value.name === tt)?.id.toString()
  const problems: ProblemListInterface | null = ttid ? await fetchProblems(ttid, Number(year)) : null

  const availableProblemSections: ProblemSectionInterface[] = []
  problems?.forEach((problem) => {
    problem.problem_sections.forEach((section) => {
      if (!availableProblemSections.find((sec) => sec.id === section.id)) {
        availableProblemSections.push(section)
      }
    })
  })
  availableProblemSections.sort(
    (section_1, section_2) =>
      section_1.section_science - section_2.section_science || section_1.title.localeCompare(section_2.title)
  )

  return (
    <>
      <Suspense fallback={"Load search params"}>
        <SearchParamsUpdator />
      </Suspense>
      <div className={style.problemPage}>
        <div className={style.problemsContainer}>
          {/* <h2>Задачи на {availableTournamentTypes.find((val) => val.name === tt)?.longName}</h2> */}
          {tt && (
            <ProblemFilters
              possibleSections={availableProblemSections}
              possibleYears={possibleYears}
              isModerator={isEditable}
            >
              {isUndefYear && <p>На {sp.year} год не найдено опубликованных задач</p>}
              {!isUndefYear && (
                <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
                  <ProblemsList sectionsFilter={sectionsFilter ?? []} problems={problems} isEditable={isEditable} />
                </Suspense>
              )}
            </ProblemFilters>
          )}
        </div>
      </div>
    </>
  )
}
