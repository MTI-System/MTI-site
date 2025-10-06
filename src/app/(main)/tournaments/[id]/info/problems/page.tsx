import {fetchProblemsForTournament} from "@/scripts/ApiFetchers";
import {ReactNode} from "react";
import ProblemsList from "@/components/problems/ProblemsList";

export default async function InfoProblemsTournamentPage(
    {params}: { params: Promise<{ id: number }>}
){
    const id = (await params).id;
    const problems = await fetchProblemsForTournament(id)
    return (
        <>
            <h1>Раздел c задачами на этом турнире</h1>
            <ProblemsList problems={problems} isEditable={false}  sectionsFilter={[]}/>
        </>
    )
}