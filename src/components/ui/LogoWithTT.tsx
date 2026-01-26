"use client"
import footerStyle from "@/styles/components/sections/app/footer.module.css"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { ReactNode } from "react"
import ColoredTType from "@/components/ui/ColoredTType"

export default function LogoWithTT({
  logoSize,
  margin,
  children,
  className,
}: {
  logoSize: string
  margin: string
  children: ReactNode
  className?: string
}) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const availableTournamentTypes = useAppSelector((state) => state.searchParams.availableTournamentTypes) ?? []

  const ttObject = availableTournamentTypes.find((t) => t.id === tt)

  return (
    <div className="text-text-main">
      {children}
      {/*<p className="leading-none font-bold" style={{ fontSize: logoSize, marginTop: margin }}>*/}
      {/*  {ttObject?.name?.slice(0, -1)}*/}
      {/*  <span style={{ color: ttObject?.color }}>{ttObject?.name?.slice(-1)}</span>*/}
      {/*</p>*/}
      <ColoredTType
        ttName={ttObject?.name ?? "ТЮФ"}
        ttColor={ttObject?.color ?? "#000000"}
        className="text-4xl font-bold"
      />
    </div>
  )
}
