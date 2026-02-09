"use client"
import { useGetFightContainerCardQuery } from "@/api/tournaments/clientApiInterface";

export interface FightData {
  id: number
  actions: number[]
  is_location_link: boolean
  location: string
  startTime: number
  jouries: number[]
  teams: Array<{
    id: number;
    name: string;
    score: number;
    coefficient: number;
    reported_problem?: number;
    reporterScore?: number;
    opponentScore?: number;
    reviewerScore?: number;
  }>
}

export interface ConfigData {
  fightId: string
  rooms: number[]
  data: number[][]
}

export default function AssignmentRoomsTable({ fightNum, rooms, config, getTeamValue }: { fightNum: string, rooms: string[], config: ConfigData | undefined, getTeamValue: (num: number) => string | number }) {
  const { data: fightContainerInfo } = useGetFightContainerCardQuery({ id: Number(fightNum) })

  return (
    <div className="border-border rounded-2xl border w-full">
      <div className="border-b border-border flex justify-center font-bold py-1.5 text-text-main">{fightContainerInfo?.title}</div>
      <table className="w-full table-fixed text-text-main">
        <thead>
          <tr className="border-b border-border">
            {rooms.map((room, roomIndex) => (
              <th className={`py-0.5 ${roomIndex > 0 ? "md:border-l-border md:border-l" : ""}`} key={roomIndex}>{room}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {/*{JSON.stringify(config)}*/}
        {config && config.data.map((row, rowIndex) => (
          <tr key={rowIndex} className="text-center">
            {row.map((cell, colIndex) => (
              <td className={`text-ellipsis overflow-hidden whitespace-nowrap py-1 px-2 ${colIndex > 0 ? "md:border-l-border md:border-l" : ""}`} key={colIndex}>{getTeamValue(cell)}</td>
            ))}
          </tr>
        ))}

        </tbody>
      </table>
    </div>
  )
}
