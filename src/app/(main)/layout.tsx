import { TournamentTypeProvider } from "@/context/app/TournamentContext"
import TournamentTypeSelector from "@/components/sections/app/TournamentTypeSelector"
import GlobalSearch from "@/components/sections/app/SearchBar"
import { FaMoon } from "react-icons/fa"
import { FaUserCircle } from "react-icons/fa"
import headerStyle from "@/styles/app/header.module.css"
import footerStyle from "@/styles/app/footer.module.css"
import "@/styles/app/main.css"
import Link from "next/link"
import type { Metadata } from "next";
import Loading from "@/app/(main)/loading";
import {Suspense} from "react";

export const metadata: Metadata = {
  title: {
    template: "МТИ",
    default: "МТИ - Менеджер Турнирной Информации",
  },
  verification: {
    yandex: 'aa838087dd1ef992',
  },
}

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body>
        <Suspense fallback={<Loading/>}>
          <TournamentTypeProvider>
          <header className={headerStyle.header}>
            <div className={headerStyle.rightContainer}>
              <Link href={"/"}>
                <h1>МТИ</h1>
              </Link>
              <TournamentTypeSelector className={headerStyle.dropdown} />
            </div>
            <div className={headerStyle.rightContainer}>
              <GlobalSearch />
              <FaMoon />
              <Link href={"/profile"}>
                <FaUserCircle />
              </Link>
            </div>
          </header>
          <main>{children}</main>
          <footer className={footerStyle.footer}></footer>
        </TournamentTypeProvider>
        </Suspense>
      </body>
    </html>
  )
}

export default RootLayout
