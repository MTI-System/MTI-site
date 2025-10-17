import BigCardHeader from "./BigCardHeader"
import SmallCardHeader from "./SmallCardHeader"

export default function CardHeader({ cardType, children }: { cardType: "big" | "small"; children: React.ReactNode }) {
  return (
    <>
      {cardType === "big" && <BigCardHeader>{children}</BigCardHeader>}
      {cardType === "small" && <SmallCardHeader>{children}</SmallCardHeader>}
    </>
  )
}
