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

export const metadata: Metadata = {
  title: {
    template: "МТИ",
    default: "МТИ - Менеджер Турнирной Информации",
  },
  verification: {
    yandex: '0fe3e0637eabec96',
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
        <TournamentTypeProvider>
          <header className={headerStyle.header}>
            <div className={headerStyle.rightContainer}>
              <Link href={"/"}>
                <h2>МТИ</h2>
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
      </body>
    </html>
  )
}

export default RootLayout
