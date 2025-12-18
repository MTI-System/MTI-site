import FightList from "@/components/tournaments/FightList";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"


export default function Page() {
  return (
    <TournamentsProviderWrapper>
      <FightList/>
    </TournamentsProviderWrapper>
  )
}

