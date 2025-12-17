import FightList from "@/components/tournaments/FightList";

export default async function TournamentsFightsPage() {
  return (
    <>
      <h1 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main">Раздел боев</h1>
      <FightList/>
    </>
  )
}
