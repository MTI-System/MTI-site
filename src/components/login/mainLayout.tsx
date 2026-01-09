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
        <div className="bg-bg-alt flex w-screen max-w-160 flex-col items-center justify-center gap-4 overflow-hidden rounded-4xl px-6 py-10 sm:max-h-[90vh] md:max-h-screen">
          <Link href="/" className="text-text-main text-5xl font-bold">
            <span className="">МТИ</span>
            <ColoredTType ttName={ttObject?.name ?? "ТЮФ"} ttColor={ttObject?.color ?? "#000000"} />
          </Link>
          <div className="w-full px-6">
            <div className="border-border flex flex-col gap-2 rounded-2xl border px-2 py-5">
              <h2 className="text-text-main text-center text-2xl font-bold">{title}</h2>
              <p className="text-text-alt text-md text-center font-medium">{description}</p>
            </div>
          </div>
          <div className="h-fit w-full px-6 md:h-full md:overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
