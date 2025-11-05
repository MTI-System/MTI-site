"use client"
import { useState } from "react"
import { TournamentCardInterface } from "@/types/TournamentsAPI"
import TournamentCard from "./TournamentCard"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

import { setPage } from "@/redux_stores/Tournaments/TournamentsPageFiltersSlice"
import Loading from "@/app/loading"
import { useTournamentsDispatch, useTournamentsSelector } from "@/components/Redux/tournamentsStoreContext"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import clsx from "clsx"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Link from "next/link"
import { Right, User } from "@/types/authApi"
import NoTournaments from "@/components/service/NoTournaments"

export default function TournamentCardsSpinner({
  tournamentsCards,
  isModerating,
  rights,
  currentPage,
}: {
  tournamentsCards: TournamentCardInterface[]
  isModerating: boolean
  rights?: Right[] | null
  currentPage: number
}) {
  const isOrganizator = (rights ?? []).filter((r) => r.right_flag === "CREATE_TOURNAMENTS").length !== 0 && isModerating
  const currentItems = tournamentsCards

  if (tournamentsCards.length === 0 && !isOrganizator) {
    return (
      <>
        <div className="h-full">
          <div className="flex h-full items-center justify-center pt-5">
            <NoTournaments />
          </div>
        </div>
      </>
    )
  }
  return (
    <div className="relative">
      <div className="flex items-center justify-center pt-5">
        <div
          className={`grid w-[90%] grid-cols-1 gap-2 gap-y-4 transition-opacity duration-300 lg:grid-cols-[repeat(auto-fill,minmax(25rem,1fr))]`}
        >
          {currentPage === 1 && isOrganizator && (
            <>
              <Link
                className={clsx(
                  "bg-bg-alt border-bg-main hover:border-accent-primary flex h-20 w-full flex-col overflow-hidden rounded-3xl border-2 transition-all duration-500 md:h-30 lg:h-148",
                )}
                href="/organizators/create"
              >
                <div
                  className="size-full bg-blue-700 text-[0.65rem] md:text-[0.8rem] lg:text-[1rem]"
                  style={{
                    WebkitMaskImage: `url('${FILES_SERVER + "add_2_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"}')`,
                    maskImage: `url('${FILES_SERVER + "add_2_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"}')`,
                    WebkitMaskSize: `${5}em ${5}em`,
                    maskSize: `${5}em ${5}em`,
                    WebkitMaskRepeat: "no-repeat", // повторяем только по X
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center", // одна строка по центру по Y
                    maskPosition: "center",
                  }}
                ></div>
              </Link>
            </>
          )}
          {currentItems.map((tournamentCard) => (
            <TournamentCard
              key={tournamentCard.id}
              tournamentCard={tournamentCard}
              isExtended={false}
              isCreate={false}
              onUpdateCreate={null}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
