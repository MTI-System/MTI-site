import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import Loading from "@/app/(main)/loading"
import { Suspense } from "react"

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <TournamentsProviderWrapper>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </TournamentsProviderWrapper>
  )
}
