import ClickableCard from "@/components/ui/ClickableCard"


export default function Home() {
  return (
    <div className="cardGrid">
      <ClickableCard className="Tournaments" href="/tournaments">Турниры</ClickableCard>
      <ClickableCard className="Problems" href="/problems">Задачи</ClickableCard>
    </div>
  )
}
