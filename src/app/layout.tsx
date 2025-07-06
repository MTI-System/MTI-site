import { IoLogoCodepen } from "react-icons/io"
import { FaMoon } from "react-icons/fa"
import { FaUserCircle } from "react-icons/fa"
import headerStyle from "@/styles/app/header.module.css"
import footerStyle from "@/styles/app/footer.module.css"
import "@/styles/app/main.css"
import Link from "next/link"

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body>
        <header className={headerStyle.header}>
          <div className={headerStyle.rightContainer}>
            <IoLogoCodepen className={"logo"} />
            <Link href={"/"}>
              <h2>МТИ</h2>
            </Link>
            <input placeholder="Тюф/Тюе" className="search"></input>
          </div>
          <div className={headerStyle.rightContainer}>
            <input placeholder="Поиск" className="search"></input>
            <FaMoon className="icon-button" />
            <Link href={"/profile"}>
              <FaUserCircle className="icon-button" />
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className={footerStyle.footer}></footer>
      </body>
    </html>
  )
}

export default RootLayout
