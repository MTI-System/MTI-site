import { IoLogoCodepen } from "react-icons/io"
import { FaMoon } from "react-icons/fa"
import { FaUserCircle } from "react-icons/fa"
import "@/styles/app/header.css"
import "@/styles/app/main.css"
import "@/styles/app/footer.css"
import Link from 'next/link';

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body>
        <header className="horizontal header-gap">
          <div className="horizontal">
            <IoLogoCodepen className={"logo"} />
            <h2>МТИ</h2>
            <input placeholder="Тюф/Тюе" className="search"></input>
          </div>
          <div className="horizontal">
            <input placeholder="Поиск" className="search"></input>
            <FaMoon className="icon-button" />
            <FaUserCircle className="icon-button" />
          </div>
        </header>
          {children}
        <footer>
          <p>adsfs</p>
        </footer>
      </body>
    </html>
  )
}

function Loading(){
return <h1>Loading...</h1>
}

export default RootLayout
