"use client"
import { useTournamentPageSelector } from "@/components/Redux/TournamentPageStoreContext"
import Loading from "@/app/loading"
import { TextEmbedding } from "@/components/materials/TextEmbedding"
import { useGetMaterialListQuery } from "@/api/materials/clientApiInterface"
import { ExpandableImage } from "../materials/ImageEmbeddings"
import UniversalPlayer from "../materials/VideoEmbedding"
import UniversalEmbedding from "../materials/UniversalEmbedding"
import MaterialsProviderWrapper from "@/api/materials/ClientWrapper"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import { FILES_SERVER } from "@/constants/APIEndpoints"
// import { FileEmbedding } from "../materials/FileEmbeddings"

export default function AboutTournamentPage() {
  const tournament = useTournamentPageSelector((state) => state.tournamentPage.tournament)

  if (!tournament) {
    return <>Loading...</>
  }
  const { data: materials } = useGetMaterialListQuery({ ids: tournament.materials })

  return (
    <ProblemsProviderWrapper>
      <div className="flex w-full flex-col gap-4 px-4">
        {!materials && <Loading />}
        {materials &&
          materials.map((material) => {
            switch (material.content_type.type_name) {
              case "Text":
                return <TextEmbedding key={material.id} text={material.content} title={material.title} />
              case "Picture":
                return (
                  <div key={material.id}>
                    <h4 className="py-2 text-2xl font-bold">{material.title}</h4>
                    <ExpandableImage
                      embedding={material}
                      src={
                        material.metadata.is_external == "false" ? FILES_SERVER + material.content : material.content
                      }
                    />
                  </div>
                )
              case "Video":
                return (
                  <div key={material.id}>
                    <h4 className="text-2xl font-bold">{material.title}</h4>
                    <UniversalPlayer embedding={material} />
                  </div>
                )
              case "File":
              case "Document":
              case "Link":
                return <UniversalEmbedding key={material.id} embedding={material} />
              default:
                return (
                  <p key={material.id} className="text-text-alt w-full text-center text-2xl">
                    Ошибка: Неизвестный материал
                  </p>
                )
            }
          })}
      </div>
    </ProblemsProviderWrapper>
  )
}
