"use client"
import ColoredTType from "@/components/ui/ColoredTType"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import ShareButton from "@/components/problems/ShareButton"
import { YearFilter } from "@/components/problems/ProblemsFilter"
import { useTournamentsDispatch, useTournamentsSelector } from "@/components/Redux/tournamentsStoreContext"
import { setState, setYear } from "@/redux_stores/Tournaments/TournamentsPageFiltersSlice"
import { Dropdown, DropdownElement, DropdownOptionInterface, DropdownTrigger } from "@/components/ui/Dropdown"
import twclsx from "@/utils/twClassMerge"
import { TournamentState } from "@/types/TournamentStateType"
import { ReactNode } from "react"
import Loading from "@/app/(main)/loading"

export default function TournamentsFilters({
  children,
  availableYears,
  availableStates,
}: {
  children: ReactNode
  availableYears: number[]
  availableStates: TournamentState[]
}) {
  const availableTournamentTypes = useAppSelector((state) => state.searchParams.availableTournamentTypes) ?? []
  const tt = useAppSelector((state) => state.searchParams.tt)
  const dispatch = useTournamentsDispatch()
  const state = useTournamentsSelector((state) => state.tournamentsPageFilters.state)
  const year = useTournamentsSelector((state) => state.tournamentsPageFilters.year)
  const isPending = useAppSelector((state) => state.system.isPending)
  return (
    <>
      <div className="flex w-full items-center justify-between px-30 pt-3">
        <div className="flex h-fit w-full content-center items-center gap-5 pt-2 flex-row md:flex-col">
          <div>
            <p className="text-text-main text-4xl font-bold">Турниры</p>
            <ColoredTType
              ttName={availableTournamentTypes.find((t) => t.id === tt)?.name ?? "ТЮФ"}
              ttColor={availableTournamentTypes.find((t) => t.id === tt)?.color ?? "#000000"}
              className="text-text-main text-4xl font-bold"
            />
          </div>
          <div className="flex gap-2">
            <YearFilter
              possibleYears={availableYears ?? []}
              isPending={false}
              isModerator={false}
              onSwitchYear={(year: number) => {
                dispatch(setYear(year))
              }}
              defaultValue={year ?? (availableYears ? availableYears[availableYears.length - 1] : 2026)}
            />
            <TournamentStateFilter
              possibleStates={availableStates}
              isPending={false}
              onSwitch={(state: TournamentState) => {
                dispatch(setState(state))
              }}
              defaultValue={state}
            />
          </div>
        </div>
        <ShareButton />
      </div>
      {!isPending && children}
      {isPending && <Loading />}
    </>
  )
}

export function TournamentStateFilter({
  possibleStates,
  isPending,
  onSwitch,
  defaultValue,
}: {
  possibleStates: TournamentState[]
  isPending: boolean
  onSwitch: (state: TournamentState) => void
  defaultValue: TournamentState
}) {
  // const year = useProblemsSelector((state) => state.problemsPageFilters.year) ?? possibleYears[0]
  // const problemDispatcher = useProblemsDispatch()
  const optionList: { children: string; value: TournamentState; active: boolean }[] = [
    {
      children: `Все турниры`,
      value: "all",
      active: true,
    },
    ...possibleStates?.map((p) => {
      return {
        children:
          p === "futured"
            ? `Запланированные`
            : p === "registration"
              ? "Регистрация"
              : p === "processing"
                ? "Идущие"
                : p === "ended"
                  ? "Завершенные"
                  : "Другие",
        value: p,
        active: true,
      }
    }),
  ]

  return (
    <Dropdown
      trigger={
        <DropdownTrigger
          disabled={isPending}
          className={twclsx("bg-bg-alt hover:bg-hover h-8 rounded-full", { "hover:bg-[var(--bg-color)]!": isPending })}
        >
          {/*{year}*/}
          {optionList.find((o) => o.value === defaultValue)?.children}
        </DropdownTrigger>
      }
      onOptionSelect={(option: DropdownOptionInterface<TournamentState> | null) => {
        if (!option) return
        onSwitch(option.value)
        // problemDispatcher(setYear(option.value))
      }}
    >
      {optionList.map((opts, i) => (
        <DropdownElement key={i + 1} {...opts} />
      ))}
    </Dropdown>
  )
}
