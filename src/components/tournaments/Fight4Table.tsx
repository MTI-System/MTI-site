'use client'
import { ProblemCardContent } from "../problems/ProblemCard";
import { useGetProblemsByIdQuery } from "@/api/problems/clientApiInterface"

export function Fight4Table({ team }: {
    team: {
        team_name: string;
        team_id: number;
        problem_id: number | undefined;
    }
}) {
    const { data: problemInfo, isLoading: isProblemLoading } = useGetProblemsByIdQuery({
        problemId: team.problem_id,
    }, {skip: !team.problem_id})

    return (
        <>
            <div className="flex border border-border rounded-2xl h-full">
                <div className="w-[30%] flex flex-col justify-center p-2.5 border-r border-border">
                    <span className="overflow-hidden text-center text-xl font-medium text-text-main text-nowrap break-all text-ellipsis">{team.team_name}</span>
                    </div>
                <div className="w-[70%] p-2.5">
                    {problemInfo ? <ProblemCardContent problem={problemInfo} isEditable={false} />:<p>Задача пока не выбрана</p>}
                </div>
            </div>
        </>
    )
}