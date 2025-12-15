"use client"
import { useGetAllTournamentCardsQuery, useGetTournamentCardsQuery } from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import { useEffect, useState } from "react"

export default function Page() {
  return (
    <TournamentsProviderWrapper>
      <QueryTest />
    </TournamentsProviderWrapper>
  )
}

function QueryTest() {
  // const { data, isLoading, error, isSuccess } = useGetAllTournamentCardsQuery({})
  const [tt, setTT] = useState(1)
  const { data, isLoading, error, isSuccess } = useGetTournamentCardsQuery({ tt: tt, year: 2026 })

  useEffect(() => {
    console.log(data, isLoading, isSuccess, error)
    if (isLoading) return
    if (!isSuccess) {
      console.error(error)
      return
    }
    console.log(data?.length)
  }, [isLoading])

  return (
    <p
      onClick={() => {
        setTT((prev) => prev + 1)
      }}
    >
      {data?.length}
    </p>
  )
}
