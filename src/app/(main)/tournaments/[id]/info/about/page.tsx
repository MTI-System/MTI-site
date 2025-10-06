import AboutPage from "@/app/(main)/about/page";
import AboutTournamentPage from "@/components/tournaments/AboutPage";

export default async function InfoTournamentPage(
    {params}: { params: Promise<{ id: number }>}
){
    return (
        <>
            <AboutTournamentPage/>
        </>
    )
}