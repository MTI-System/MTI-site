"use client"
import {
  Dropdown,
  DropdownElement,
  DropdownMulti,
  DropdownMultiElement,
  DropdownOptionInterface,
  DropdownTrigger,
} from "@/components/ui/Dropdown"
import style from "@/styles/components/sections/problems/problemsFilter.module.css"
import { ReactNode, useEffect, useState } from "react"
import Loading from "@/app/loading"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { AddProblem } from "./ProblemForms"
import { ProblemSectionInterface } from "@/types/problemAPI"
import ProblemSection from "./ProblemSection"
import { FaTimes } from "react-icons/fa"
import ColoredTType from "@/components/ui/ColoredTType"
import twclsx from "@/utils/twClassMerge"
import { Menu } from "@base-ui-components/react"
import { setSectionList, setTournamentFilter, setYear } from "@/redux_stores/Problems/ProblemsFiltersSlice"
import { useProblemsDispatch, useProblemsSelector } from "@/components/Redux/ProblemsStoreContext"
import ShareButton from "@/components/problems/ShareButton"
import { useGetTournamentCardsQuery } from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

export default function ProblemFilters({
  children,
  possibleYears,
  possibleSections,
  isModerator,
}: {
  children: ReactNode
  possibleYears: number[]
  possibleSections: ProblemSectionInterface[]
  isModerator: boolean
}) {
  const year = useProblemsSelector((state) => state.problemsPageFilters.year ?? possibleYears[0])
  const tt = useAppSelector((state) => state.searchParams.tt)
  const isPending = useAppSelector((state) => state.system.isPending)
  const ttid = Number(tt) ?? 1
  const availableTournamentTypes = useAppSelector((state) => state.searchParams.availableTournamentTypes) ?? []
  const problemDispatcher = useProblemsDispatch()
  return (
    <>
      <div className="flex h-fit w-full content-center items-center gap-5 pt-2">
        <p className="text-text-main text-4xl font-bold">Задачи</p>
        <ColoredTType
          ttName={availableTournamentTypes.find((t) => t.id === tt)?.name ?? "ТЮФ"}
          ttColor={availableTournamentTypes.find((t) => t.id === tt)?.color ?? "#000000"}
          className="text-text-main text-4xl font-bold"
        />
        <div className={style.filters}>
          <YearFilter
              possibleYears={possibleYears}
              isPending={isPending}
              isModerator={isModerator}
              onSwitchYear={(year: number) => {
                problemDispatcher(setYear(year))
              }}
              defaultValue={year}
          />
          <TournamentsProviderWrapper>
            <TournamentFilter isPending={isPending} />
          </TournamentsProviderWrapper>
          <SectionFilter possibleSections={possibleSections} isPending={isPending}></SectionFilter>
          <ShareButton />
        </div>
      </div>
      <AddProblem targetTTID={ttid} targetYear={year} />
      {!isPending && children}
    </>
  )
}

function SectionFilter({
  possibleSections,
  isPending,
}: {
  possibleSections: ProblemSectionInterface[]
  isPending: boolean
}) {
  const year = useProblemsSelector((state) => state.problemsPageFilters.year)
  const tt = useAppSelector((state) => state.searchParams.tt)
  const sectionList = useProblemsSelector((state) => state.problemsPageFilters.sectionList)
  const problemDispatcher = useProblemsDispatch()
  const selectedOptionState = useState<DropdownOptionInterface<number>[] | null>(null)
  const [selectedOptions, setSelectedOption] = selectedOptionState

  useEffect(() => {
    console.log("Update section list", sectionList)
    setSelectedOption(
      sectionList?.map((s) => ({
        value: s,
        children: (
          <ProblemSection
            key={s}
            section={possibleSections.find((section) => section.id === s)!}
            className="col-start-2"
          />
        ),
      })) ?? [],
    )
  }, [sectionList])

  useEffect(() => {
    console.log("selectedupdate", selectedOptions)
  }, [selectedOptions])

  useEffect(() => {
    setSelectedOption([])
  }, [year, tt])

  return (
    <div className="flex w-full min-w-0 content-center items-center">
      <DropdownMulti
        selectionState={selectedOptionState}
        onOpenChange={(open, e, selection: DropdownOptionInterface<number>[] | null) => {
          if (open) return
          if (selectedOptions?.length === 0) return
          problemDispatcher(setSectionList(selection?.map((s) => s.value) ?? null))
        }}
        trigger={
          <DropdownTrigger
            rootClassName="flex-1"
            disabled={isPending}
            className={twclsx("bg-bg-alt hover:bg-hover h-8 rounded-full", {
              "hover:bg-[var(--bg-color)]!": isPending,
            })}
          >
            {isPending ? <p className="flex-1">Выбираем...</p> : <p className="flex-1">Выбрать разделы</p>}
          </DropdownTrigger>
        }
      >
        {possibleSections.map((section, i) => (
          <DropdownMultiElement value={section.id} key={i + 1}>
            <div className="grid cursor-default grid-cols-[2rem_1fr] items-center gap-1">
              <Menu.CheckboxItemIndicator className="col-start-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={section.tile_color}>
                  <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
                </svg>
              </Menu.CheckboxItemIndicator>
              <ProblemSection key={section.id} section={section} className="col-start-2" />
            </div>
          </DropdownMultiElement>
        ))}
      </DropdownMulti>
      <FaTimes
        className={twclsx("w-20 text-[1.5rem]", {
          "text-[var(--alt-text)]": isPending || selectedOptions?.length === 0,
          "hover:text-[var(--alt-text)]": !isPending && selectedOptions?.length !== 0,
        })}
        onClick={() => {
          if (isPending || selectedOptions?.length === 0) return
          setSelectedOption([])
          problemDispatcher(setSectionList(null))
        }}
      />
    </div>
  )
}

export function YearFilter({
  possibleYears,
  isPending,
  isModerator,
  onSwitchYear,
  defaultValue
}: {
  possibleYears: number[]
  isPending: boolean
  isModerator: boolean
  onSwitchYear: (year: number) => void
  defaultValue: number
}) {
  // const year = useProblemsSelector((state) => state.problemsPageFilters.year) ?? possibleYears[0]
  // const problemDispatcher = useProblemsDispatch()
  const optionList: { children: string; value: number; active: boolean }[] = []
  possibleYears.forEach((year, index, array) => {
    if (index === 0) {
      if (isModerator)
        optionList.push({
          children: `+${year + 1}`,
          value: year + 1,
          active: true,
        })
      optionList.push({
        children: year.toString(),
        value: year,
        active: true,
      })
      return
    }
    if (isModerator)
      for (let i = year + 1; i < array[index - 1]; i++) optionList.push({ children: `+${i}`, value: i, active: true })
    optionList.push({ children: year.toString(), value: year, active: true })
  })
  if (isModerator) {
    const firstYear = possibleYears.length > 0 ? possibleYears[possibleYears.length - 1] : new Date().getFullYear() + 1
    optionList.push({
      children: `+${firstYear - 1}`,
      value: firstYear - 1,
      active: true,
    })
  }

  return (
    <Dropdown
      trigger={
        <DropdownTrigger
          disabled={isPending}
          className={twclsx("bg-bg-alt hover:bg-hover h-8 rounded-full", { "hover:bg-[var(--bg-color)]!": isPending })}
        >
          {/*{year}*/}
          {defaultValue}
        </DropdownTrigger>
      }
      onOptionSelect={(option: DropdownOptionInterface<number> | null) => {
        if (!option) return
        onSwitchYear(option.value)
        // problemDispatcher(setYear(option.value))
      }}
    >
      {optionList.map((opts, i) => (
        <DropdownElement key={i + 1} {...opts} />
      ))}
    </Dropdown>
  )
}

function TournamentFilter({ isPending }: { isPending: boolean }) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const year = useProblemsSelector((state) => state.problemsPageFilters.year)
  const { data, isLoading, isError } = useGetTournamentCardsQuery({ tt: tt ?? 1, year: year ?? 0 })
  const problemDispatcher = useProblemsDispatch()
  const optionList: DropdownOptionInterface<number>[] = [
    {
      children: <p>Все турниры</p>,
      value: 0,
      inactive: false,
    },
    ...(data?.map((val) => {
      return {
        children: <p>{val.title}</p>,
        value: val.id,
        inactive: false,
      }
    }) ?? []),
  ]
  const selectedOptionState = useState<DropdownOptionInterface<number> | null>(null)
  const [selectedOptions, setSelectedOption] = selectedOptionState

  useEffect(() => {
    setSelectedOption(null)
  }, [tt, year])
  return (
    <>
      {
        <Dropdown
          selectionState={selectedOptionState}
          trigger={
            <DropdownTrigger
              disabled={isLoading || isError || isPending}
              className={twclsx("bg-bg-alt hover:bg-hover h-8 w-[20rem] justify-between rounded-full", {
                "hover:bg-[var(--bg-color)]!": isLoading || isError,
              })}
            >
              Все турниры
            </DropdownTrigger>
          }
          onOptionSelect={(option: DropdownOptionInterface<number> | null) => {
            if (!option) return
            problemDispatcher(setTournamentFilter(option.value))
          }}
        >
          {optionList.map((opts, i) => (
            <DropdownElement key={i + 1} {...opts} />
          ))}
        </Dropdown>
      }
    </>
  )
}
