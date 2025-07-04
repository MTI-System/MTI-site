import { IoLogoCodepen } from "react-icons/io"
import { FaMoon } from "react-icons/fa"
import { FaUserCircle } from "react-icons/fa"
import headerStyle from "@/styles/app/header.module.css"
import footerStyle from "@/styles/app/footer.module.css"
import "@/styles/app/main.css"

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
            <h2>МТИ</h2>
            <div>Dropdown here...</div>{" "}
            {
              //TODO: make dropdown
            }
            {/* <input placeholder="Тюф/Тюе" className="search"></input> */}
          </div>
          <div className={headerStyle.leftContainer}>
            <input placeholder="Поиск" className={headerStyle.search}></input>
            <FaMoon className={headerStyle.iconButton} />
            <FaUserCircle className={headerStyle.iconButton} />
          </div>
        </header>
        <main>{children}</main>
        <footer className={footerStyle.footer}></footer>
      </body>
    </html>
  )
}

export default RootLayout
