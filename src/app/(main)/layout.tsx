import TournamentTypeSelector from "@/components/sections/app/TournamentTypeSelector"
import GlobalSearch from "@/components/sections/app/SearchBar"
import { FaMoon } from "react-icons/fa"
import headerStyle from "@/styles/app/header.module.css"
import footerStyle from "@/styles/app/footer.module.css"
import "@/styles/app/main.css"
import Link from "next/link"
import type { Metadata } from "next"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Script from "next/script"
import iconStyle from "@/styles/icons.module.css"
import StoreProvider from "@/components/Redux/StoreProvider"
import ProfilePicture from "@/components/sections/app/Profile"
import InitRedux from "@/components/Redux/InitRedux"

export const metadata: Metadata = {
  title: {
    template: "МТИ",
    default: "МТИ - Менеджер Турнирной Информации",
  },
  verification: {
    yandex: "aa838087dd1ef992",
  },
}

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <head>
        <link rel="shortcut icon" href={FILES_SERVER + "favicon1.ico"} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){
                (m[i].a=m[i].a||[]).push(arguments)}
              ;m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a)}
              )(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(103363565, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <InitRedux />
          <header className={headerStyle.header}>
            <div className={headerStyle.leftContainer}>
              <Link href={"/"}>
                <h1>МТИ</h1>
              </Link>
              <TournamentTypeSelector className={headerStyle.dropdown} />
            </div>
            <div className={headerStyle.rightContainer}>
              <GlobalSearch />
              <FaMoon className={iconStyle.icons} />
              <ProfilePicture className={iconStyle.icons} />
            </div>
          </header>
          <main>{children}</main>
          <footer className={footerStyle.footer}></footer>
        </StoreProvider>
      </body>
    </html>
  )
}

export default RootLayout
