import {TournamentTypeProvider} from "@/context/app/TournamentContext"
import TournamentTypeSelector from "@/components/sections/app/TournamentTypeSelector"
import GlobalSearch from "@/components/sections/app/SearchBar"
import {FaMoon} from "react-icons/fa"
import {FaUserCircle} from "react-icons/fa"
import headerStyle from "@/styles/app/header.module.css"
import footerStyle from "@/styles/app/footer.module.css"
import "@/styles/app/main.css"
import Link from "next/link"
import type {Metadata} from "next";
import Loading from "@/app/(main)/loading";
import {Suspense} from "react";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import {headers} from "next/headers";
import phoneUnavailable from "@/components/Errors/phoneUnavailable";
import PhoneUnavailable from "@/components/Errors/phoneUnavailable";
import Script from "next/script";
import iconStyle from "@/styles/icons.module.css"

export const metadata: Metadata = {
  title: {
    template: "МТИ",
    default: "МТИ - Менеджер Турнирной Информации",
  },
  verification: {
    yandex: 'aa838087dd1ef992',
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
      <link rel="shortcut icon" href={FILES_SERVER + "favicon.svg"}/>
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
    <Suspense fallback={<Loading/>}>
      <TournamentTypeProvider>
        <header className={headerStyle.header}>
          <div className={headerStyle.rightContainer}>
            <Link href={"/"}>
              <h1>МТИ</h1>
            </Link>
            <TournamentTypeSelector className={headerStyle.dropdown}/>
          </div>
          <div className={headerStyle.leftContainer}>
            <GlobalSearch/>
            <FaMoon className={iconStyle.icons}/>
            <Link href={"/profile"}>
              <FaUserCircle className={iconStyle.icons}/>
            </Link>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className={footerStyle.footer}></footer>
      </TournamentTypeProvider>
    </Suspense>
    </body>
    </html>
  )
}

export default RootLayout
