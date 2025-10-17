import CardHeader from "@/components/cards/components/headers/CardHeader"
import CardBigImage from "@/components/cards/components/headers/imagesContainers/CardBigImage"
import CardSmallImage from "@/components/cards/components/headers/imagesContainers/CardSmallImage"

export default async function SecondTmp() {
  return (
    <>
      <CardHeader cardType="small">
        <CardBigImage isEditing={false} />
        <CardSmallImage isEditing={false} />
      </CardHeader>
    </>
  )
}
