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
import {store} from "next/dist/build/output/store";
import {Provider} from 'react-redux'
import StoreProvider from "@/components/Redux/StoreProvider";
import SearchParamsUpdator from "@/components/SearchParamsUpdator";
import ProfilePicture from "@/components/sections/app/Profile";
import InitRedux from "@/components/Redux/InitRedux";
import {fetchPermissions} from "@/scripts/ApiFetchers";
import Header from "@/components/sections/app/Header"
import Footer from "@/components/sections/app/Footer";

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
      <link rel="shortcut icon" href={FILES_SERVER + "favicon1.ico"}/>
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
      <InitRedux/>
        <Header/>
      <main>
        {children}
      </main>
      <Footer/>
    </StoreProvider>
    </body>
    </html>
  )
}

export default RootLayout
