"use client"
import { useTournamentPageSelector } from "@/components/Redux/TournamentPageStoreContext"
import Loading from "@/app/loading"
import { TextEmbedding } from "@/components/materials/TextEmbedding"
import { useGetMaterialListQuery } from "@/api/materials/clientApiInterface"

export default function AboutTournamentPage() {
  const tournament = useTournamentPageSelector((state) => state.tournamentPage.tournament)

  if (!tournament) {
    return <>Loading...</>
  }
  const { data: materials } = useGetMaterialListQuery({ ids: tournament.materials })

  return (
    <>
      {!materials && <Loading />}
      {materials &&
        materials.map((material) => {
          switch (material.content_type.type_name) {
            case "Text":
              return <TextEmbedding key={material.id} text={material.content} title={material.title} />
            default:
              return <>None</>
          }
        })}
    </>
  )
}
