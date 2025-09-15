import ProblemFilters from "@/components/problems/ProblemsFilter"
import ProblemsList from "@/components/problems/ProblemsList"
import {Suspense} from "react"
import {TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys"
import {fetchPermissions, fetchProblems, fetchTournamentTypes, fetchYears} from "@/scripts/ApiFetchers"
import SearchParamsUpdator from "@/components/problems/SearchParamsUpdator"
import type {Metadata} from "next"
import Loading from "@/app/loading"
import {ProblemListInterface, ProblemSectionInterface} from "@/types/problemAPI"
import {resolveAppleWebApp} from "next/dist/lib/metadata/resolvers/resolve-basics";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {ProblemsStoreProvider} from "@/components/Redux/ProblemsStoreContext";
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider";
import ShareButton from "@/components/problems/ShareButton";

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
        verification: {yandex: "aa838087dd1ef992"},
    }
}

//

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ year: string; tt: string; sections: string }>
}) {
    const sp = await searchParams
    if (!sp.year || !sp.tt) {
        return (
            <>
                <ProblemsReduxProviderWrapper>
                    <Suspense fallback={<></>}>
                        <SearchParamsUpdator searchParams={sp}/>
                    </Suspense>
                    <Loading/>
                </ProblemsReduxProviderWrapper>
            </>
        )
    }

    let tt = sp.tt ?? undefined
    const possibleYears = await fetchYears(Number(tt))
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
                    right.right_flag == "MODERATE_PROBLEMS_" + tt,
            )
            .some((x) => x)
    }
    const problems: ProblemListInterface | null = tt ? await fetchProblems(tt, Number(year)) : null

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
            section_1.section_science - section_2.section_science || section_1.title.localeCompare(section_2.title),
    )
    console.log("SearchParams", sp, new URLSearchParams(sp).toString())
    return (
        <>
            <ProblemsReduxProviderWrapper>
                <Suspense fallback={"Load search params"}>
                    <SearchParamsUpdator searchParams={sp}/>
                </Suspense>
                <div>
                    <div>
                        {tt && (
                            <ProblemFilters
                                possibleSections={availableProblemSections}
                                possibleYears={possibleYears}
                                isModerator={isEditable}
                            >


                                {isUndefYear && <p>На {sp.year} год не найдено опубликованных задач</p>}
                                {!isUndefYear && (
                                    <Suspense fallback={<h1>Loading...</h1>} key={`${year} ${tt}`}>
                                        <div className="w-full h-fit flex justify-end px-3 pt-3" >
                                            <ShareButton searchParams={sp}/>
                                        </div>
                                        <ProblemsList sectionsFilter={sectionsFilter ?? []} problems={problems}
                                                      isEditable={isEditable}/>
                                    </Suspense>
                                )}
                            </ProblemFilters>
                        )}
                    </div>
                </div>
            </ProblemsReduxProviderWrapper>

        </>
    )
}
