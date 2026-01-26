"use client"
import ColoredTType from "@/components/ui/ColoredTType"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import ShareButton from "@/components/problems/ShareButton"
import { YearFilter } from "@/components/problems/ProblemsFilter"
import { useTournamentsDispatch, useTournamentsSelector } from "@/components/Redux/tournamentsStoreContext"
import { setState, setYear } from "@/redux_stores/Tournaments/TournamentsPageFiltersSlice"
import { Dropdown, DropdownElement, DropdownOptionInterface, DropdownTrigger } from "@/components/ui/Dropdown"
import twclsx from "@/utils/twClassMerge"
import { TournamentStateFlagsInterface, TournamentStateInterface } from "@/types/TournamentStateType"
import { ReactNode } from "react"
import Loading from "@/app/(main)/loading"

export default function TournamentsFilters({
  children,
  availableYears,
  availableStates,
}: {
  children: ReactNode
  availableYears: number[]
  availableStates: TournamentStateInterface[]
}) {
  const availableTournamentTypes = useAppSelector((state) => state.searchParams.availableTournamentTypes) ?? []
  const tt = useAppSelector((state) => state.searchParams.tt)
  const dispatch = useTournamentsDispatch()
  const state = useTournamentsSelector((state) => state.tournamentsPageFilters.state)
  const year = useTournamentsSelector((state) => state.tournamentsPageFilters.year)
  const isPending = useAppSelector((state) => state.system.isPending)
  return (
    <>
      <div className="flex w-full items-center justify-between px-8 pt-3 md:px-15 lg:px-30">
        <div className="flex h-fit w-full flex-col content-center items-center gap-5 pt-2 md:flex-row">
          <div className="flex flex-row gap-5">
            <p className="text-text-main text-4xl font-bold">Турниры</p>
            <ColoredTType
              ttName={availableTournamentTypes.find((t) => t.id === tt)?.name ?? "ТЮФ"}
              ttColor={availableTournamentTypes.find((t) => t.id === tt)?.color ?? "#000000"}
              className="text-text-main text-4xl font-bold"
            />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
            <div className="flex w-full flex-col gap-2 md:flex-row">
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
                onSwitch={(state: TournamentStateFlagsInterface) => {
                  dispatch(setState(state))
                }}
                defaultValue={state}
              />
            </div>
            <ShareButton />
          </div>
        </div>
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
  possibleStates: TournamentStateInterface[]
  isPending: boolean
  onSwitch: (state: TournamentStateFlagsInterface) => void
  defaultValue: TournamentStateFlagsInterface
}) {
  // const year = useProblemsSelector((state) => state.problemsPageFilters.year) ?? possibleYears[0]
  // const problemDispatcher = useProblemsDispatch()
  const optionList: { children: string; value: TournamentStateFlagsInterface; active: boolean }[] = [
    {
      children: `Все турниры`,
      value: "all",
      active: true,
    },
    ...possibleStates?.map((p) => {
      return {
        children:
          p.status_flag === "FUTURED"
            ? `Запланированные`
            : p.status_flag === "REGISTRATION"
              ? "Регистрация"
              : p.status_flag === "PROCESSING"
                ? "Идущие"
                : p.status_flag === "ENDED"
                  ? "Завершенные"
                  : "Другие",
        value: p.status_flag,
        active: true,
      }
    }),
  ]
  console.log(possibleStates, optionList)

  return (
    <Dropdown
      trigger={
        <DropdownTrigger
          disabled={isPending}
          rootClassName="min-w-fit"
          className={twclsx("bg-bg-alt hover:bg-hover flex h-8 flex-row justify-between rounded-full", {
            "hover:bg-bg-main": isPending,
          })}
        >
          {/*{year}*/}
          {optionList.find((o) => o.value === defaultValue)?.children}
        </DropdownTrigger>
      }
      onOptionSelect={(option: DropdownOptionInterface<TournamentStateFlagsInterface> | null) => {
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
