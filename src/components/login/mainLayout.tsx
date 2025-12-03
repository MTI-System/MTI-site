"use client"
import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import ColoredTType from "../ui/ColoredTType"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function LoginLayout({
  children,
  title,
  description,
}: {
  children: ReactNode
  title: string
  description: string
}) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const availableTournamentTypes = useAppSelector((state) => state.searchParams.availableTournamentTypes) ?? []

  const ttObject = availableTournamentTypes.find((t) => t.id === tt)

  return (
    <div className="bg-bg-main flex h-screen w-screen items-center justify-center select-none">
      <div className="flex items-center justify-center">
        <div className="bg-bg-alt flex max-h-screen w-screen max-w-160 flex-col items-center justify-center gap-4 overflow-hidden rounded-4xl px-6 py-10 sm:max-h-[90vh]">
          <Link href="/" className="text-6xl font-bold">
            <span className="">МТИ</span>
            <ColoredTType
              ttName={ttObject?.name ?? "ТЮФ"}
              ttColor={ttObject?.color ?? "#000000"}
            />
          </Link>
          <div className="w-full px-6">
            <div className="border-border flex flex-col gap-2 rounded-2xl border py-5">
              <h2 className="text-text-main text-center text-3xl font-bold">{title}</h2>
              <p className="text-text-alt text-center text-lg font-medium">{description}</p>
            </div>
          </div>
          <div className="h-full w-full overflow-y-auto px-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
