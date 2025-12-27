"use client"

import { useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import twclsx from "@/utils/twClassMerge"
import { EventData } from "@/components/tournamentPage/FightsPage/FightTable"
import Link from "next/link"
import { FaExternalLinkAlt } from "react-icons/fa"

export default function FightTable({ fight, type }: { fight: EventData[]; type: "team" | "jury" }) {
  const maxTeams = Math.max(...fight.map((room) => room.teams.length))
  const maxTeamsArr = Array.from({ length: maxTeams })
  const maxJouries = Math.max(...fight.map((room) => room.jouries.length))
  const maxJouriesArr = Array.from({ length: maxJouries })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const JuryCell = ({ juryId, leader }: { juryId: number; leader: boolean }) => {
    const { data: userData, isLoading: userIsLoading, isError: userIsError } = useGetUserByIdQuery({ id: juryId })
    return (
      <div className="text-text-main px-2 py-2 text-center">
        {userIsLoading ? (
          <div className="bg-bg-main h-full min-h-5 w-full min-w-50 animate-pulse rounded-full"></div>
        ) : (
          <p className={twclsx("w-full text-center", { "text-accent-warning": userIsError, "font-bold": leader })}>
            {userIsError || !userData
              ? "Error"
              : userData.secondName + " " + userData.firstName + " " + userData.thirdName}{" "}
            {leader ? " (ведущий)" : ""}
          </p>
        )}
      </div>
    )
  }
  // --------------DELETE LATER-------------
  const roomNames = ["A", "B", "C"]
  // ---------------------------------------
  return (
    <div className="border-border mt-2 flex h-full w-[75vw] flex-col gap-2 md:mt-0 md:w-full md:flex-row md:gap-0 md:overflow-auto md:border-t">
      {fight.map((fightItem, fightIdx) => (
        <div
          key={fightIdx}
          className={`border-border text-text-main w-full overflow-auto rounded-xl border text-center font-medium md:w-fit md:shrink-0 md:grow md:rounded-none md:border-0 ${fightIdx > 0 ? "md:border-l-border md:border-l" : ""}`}
        >
          {true ? (
            <Link
              href={fightItem.location}
              className="border-border hover:text-text-alt flex items-center justify-center gap-2 border-b p-2 transition-colors"
            >
              <p>Комната {roomNames[fightIdx]}</p>
              <FaExternalLinkAlt />
            </Link>
          ) : (
            <div className="border-border flex items-center justify-center border-b p-2">{fightItem.location}</div>
          )}
          <div className="flex items-center justify-center p-2">
            {formatDate(new Date(fightItem.startTime))} (локальное время)
          </div>

          {type === "team" &&
            maxTeamsArr.map((item, idx) => {
              const team = fightItem.teams[idx]
              return (
                <div
                  key={idx}
                  className="border-border text-text-main h-10 truncate border-t p-2 text-center font-medium"
                >
                  {team ? team.name : ""}
                </div>
              )
            })}

          {type === "jury" &&
            maxJouriesArr.map((item, idx) => {
              const juryId = fightItem.jouries[idx]
              return (
                <div key={idx} className={twclsx("border-border border-t")}>
                  {idx < fightItem.jouries.length && <JuryCell leader={idx === 0} juryId={juryId} />}
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}
