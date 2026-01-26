import "@fontsource-variable/roboto-mono"
import "@fontsource-variable/roboto-flex"
import "@/styles/main.css"
import type { Metadata } from "next"
import Script from "next/script"
import { cookies } from "next/headers"
import StoreProvider from "@/components/Redux/StoreProvider"
import LayoutComponent from "@/components/main/Layout"
import ThemeUpdator from "@/components/Redux/ThemeUpdator"
import { ReactNode } from "react"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import "react-day-picker/style.css"

export function generateMetadata(): Metadata {
  const titleText = "Главная · МТИ"
  const descriptionText = "Главная страница Менеджера Турнирной Информации"

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

export default async function Template({ children }: { children: ReactNode }) {
  const cookiesStore = await cookies()
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}))
  const { data: tournamentTypes } = await promise
  return (
    <html className="bg-bg-main">
      <head>
        <link rel="icon" href="https://mtiyt.ru/favicon.ico" type="image/x-icon" />
        <script
          defer
          src="https://metrika.mtiyt.ru/script.js"
          data-website-id="8e028138-b03c-4ba1-a1a1-1b00fff2e564"
        ></script>
      </head>

      <StoreProvider
        tt={cookiesStore.get("mtiyt_tournamentType")?.value ?? "ТЮФ"}
        theme={cookiesStore.get("theme")?.value ?? "light"}
        token={cookiesStore.get("mtiyt_auth_token")?.value ?? ""}
        tournamentTypes={tournamentTypes}
      >
        <ThemeUpdator />

        <LayoutComponent>{children}</LayoutComponent>
      </StoreProvider>
    </html>
  )
}
