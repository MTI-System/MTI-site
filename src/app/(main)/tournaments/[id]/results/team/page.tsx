import ResultsTable from "@/components/tournamentPage/ResutsTable";
import {Suspense} from "react";

export default async function TournamentResultPage(
    {params}: { params: Promise<{ id: string }> }
){
    const id = (await params).id
    return (
        <>
            <Suspense fallback={<h1>Loading...</h1>}>
                <ResultsTable tournamentId={Number(id)}/>
            </Suspense>

        </>
    )
}