import ProblemsList from "@/components/problems/ProblemsList";
import {makeProblemsStoreServer} from "@/api/problems/serverStore";
import {problemsApiServer} from "@/api/problems/serverApiInterface";

export default async function InfoProblemsTournamentPage(
    {params}: { params: Promise<{ id: number }> }
) {
    const id = (await params).id;
    // const problems = await fetchProblemsForTournament(id)
    const store = makeProblemsStoreServer()
    const promise = store.dispatch(
        problemsApiServer.endpoints.getProblemsForTournament.initiate(
            {tournamentId: id},
            {subscribe: false, forceRefetch: true})
    )
    const { data: problems, isLoading,  isError, error} = await promise
    return (
        <>
            <h1>Раздел c задачами на этом турнире</h1>
            <ProblemsList problems={problems} isEditable={false} sectionsFilter={[]}/>
        </>
    )
}