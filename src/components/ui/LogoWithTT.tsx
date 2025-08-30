"use client"
import footerStyle from "@/styles/components/sections/app/footer.module.css"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { ReactNode } from "react"

export default function LogoWithTT({
  logoSize,
  margin,
  children,
}: {
  logoSize: string
  margin: string
  children: ReactNode
}) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  return (
    <div>
      {children}
      <p className="" style={{ fontSize: logoSize, marginTop: margin }}>
        {tt?.slice(0, -1)}
        <span style={{ color: availableTournamentTypes.find((type) => type.name === tt)?.color }}>{tt?.slice(-1)}</span>
      </p>
    </div>
  )
}
