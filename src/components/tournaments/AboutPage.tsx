"use client"
import {useTournamentPageSelector} from "@/components/Redux/TournamentPageStoreContext";
import {fetchEmbeddingsInfo} from "@/scripts/ApiFetchers";
import {useEffect, useState} from "react";
import {EmbeddingInterface} from "@/types/embeddings";
import Loading from "@/app/loading";
import {TextEmbedding} from "@/components/materials/TextEmbedding";

export default function AboutTournamentPage() {
    const tournament = useTournamentPageSelector(state => state.tournamentPage.tournament)
    if (!tournament) {
        return <>Loading...</>
    }
    const [materials, setMaterials] = useState<EmbeddingInterface[] | null>(null)
    const getMaterials = async () => {
        setMaterials(await fetchEmbeddingsInfo(tournament.materials));
    }
    useEffect(() => {
        if (materials == null) {
            getMaterials();
        }
    }, []);
    return (
        <>
            {materials === null && <Loading/>}
            {materials !== null && materials.map(material => {
                switch (material.content_type.type_name) {
                    case "Text":
                        return <TextEmbedding
                            key={material.id}
                            text={material.content}
                            title={material.title}
                        />;
                    default:
                        return <>None</>;
                }
            })}
        </>
    )
}