"use client"

import { useGetUserByIdQuery } from "@/api/users/clientApiInterface";
import twclsx from "@/utils/twClassMerge";
import {EventData} from "@/components/tournamentPage/FightsPage/FightTable";



export default function FightTable({ fight, type }: { fight: EventData[], type: 'team' | 'jury' }) {
    const maxTeams = Math.max(...fight.map(room => room.teams.length));
    const maxTeamsArr = Array.from({ length: maxTeams });
    const maxJouries = Math.max(...fight.map(room => room.jouries.length));
    const maxJouriesArr = Array.from({ length: maxJouries });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const JuryCell = ({ juryId, leader }: { juryId: number, leader: boolean }) => {
        const { data: userData, isLoading: userIsLoading, isError: userIsError } = useGetUserByIdQuery({ id: juryId })
        return (
            <div className="text-center text-text-main px-2 py-2">
                {userIsLoading ? <div className="w-full min-w-50 h-full animate-pulse bg-bg-main min-h-5 rounded-full"></div> :
                  <p className={twclsx("w-full text-center", { "text-accent-warning": userIsError, "font-bold": leader })}>{userIsError || !userData ? "Error" :
                    userData.secondName + " " + userData.firstName + " " + userData.thirdName} {leader ? " (ведущий)" : ""}</p>}
            </div>
        );
    };

    return (
        <div className="w-[75vw] border-border h-full flex flex-col gap-2 mt-2 md:gap-0 md:flex-row md:overflow-auto md:mt-0 md:w-full md:border-t">
            {fight.map((fightItem, fightIdx) =>
                <div key={fightIdx} className={`text-center border rounded-xl border-border text-text-main font-medium w-full overflow-auto md:border-0 md:rounded-none md:shrink-0 md:grow md:w-fit ${fightIdx > 0 ? 'md:border-l md:border-l-border' : ''}`}>
                    <div className="flex items-center justify-center p-2 border-b border-border">{fightItem.location}</div>
                    
                    <div className="flex items-center justify-center p-2">{formatDate(new Date(fightItem.startTime))}</div>

                    {type === 'team' && maxTeamsArr.map((item, idx) => {
                        const team = fightItem.teams[idx];
                        return (
                            <div key={idx} className="h-10 border-t border-border text-center text-text-main font-medium p-2 truncate">
                                {team ? team.name : ""}
                            </div>
                        )}
                    )}

                    {type === 'jury' && maxJouriesArr.map((item, idx) => {
                        const juryId = fightItem.jouries[idx];
                        return (
                            <div key={idx} className={twclsx("border-t border-border")}>
                              {idx < fightItem.jouries.length && <JuryCell leader={idx===0} juryId={juryId}/>}
                            </div>
                        )}
                    )}
                </div>
            )}
        </div>
    )
}
