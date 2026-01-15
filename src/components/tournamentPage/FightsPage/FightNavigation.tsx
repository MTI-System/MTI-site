"use client"
import { Tabs } from "@base-ui-components/react"
import FightTable from "./FightTable"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

interface TabInterface {
  title: string
  value: string
  icon: string
}

export default function FightNavigationWrapper() {
  return (
    <TournamentsProviderWrapper>
      <FightNavigation />
    </TournamentsProviderWrapper>
  )
}

function FightNavigation() {
  const tabs: TabInterface[] = [
    // {
    //     title: "Общая информация",
    //     value: "summary",
    //     icon: "SummaryIcon.svg",
    // },
    {
      title: "Расписание команд",
      value: "teamTimetable",
      icon: "TeamTimetableIcon.svg",
    },
    {
      title: "Расписание для жюри",
      value: "juryTimetable",
      icon: "JuryTimetableIcon.svg",
    },
  ]

  return (
    <>
      <Tabs.Root className="size-full w-full px-3" defaultValue={tabs[0].value}>
        <Tabs.List className="w-ful border-border relative z-0 flex flex-row gap-1 overflow-x-auto rounded-xl border px-4 py-1 md:flex-row md:py-0">
          {tabs.map((item, idx) => (
            <Tabs.Tab
              key={idx}
              className="w-ful text-text-alt before:outline-accent-primary hover:text-text-main data-active:text-text-main flex h-8 flex-1 cursor-pointer items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2"
              value={item.value}
            >
              {item.title}
            </Tabs.Tab>
          ))}

          <Tabs.Indicator className="w-ful bg-bg-main absolute top-1/2 left-0 z-[-1] h-6 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-sm transition-all duration-200 ease-in-out" />
        </Tabs.List>

        {tabs.map((item, idx) => (
          <Tabs.Panel
            key={idx}
            className="w-ful outline-accent-primary relative flex h-fit items-center justify-center py-2.5 -outline-offset-1 focus-visible:rounded-md focus-visible:outline"
            value={item.value}
          >
            {item.value === "juryTimetable" && <FightTable type="jury"></FightTable>}
            {item.value === "teamTimetable" && <FightTable type="team"></FightTable>}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </>
  )
}
