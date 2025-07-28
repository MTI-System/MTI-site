import "@/styles/app/main.css"
import type { Metadata } from "next"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Script from "next/script"
import StoreProvider from "@/components/Redux/StoreProvider"
import Header from "@/components/sections/app/Header"
import Footer from "@/components/sections/app/Footer"
import { cookies } from "next/headers"
import LayoutComponent from "@/components/sections/app/Layout"

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
      <StoreProvider theme={(await cookies()).get("theme")?.value ?? "light"}>
        <LayoutComponent>
          <Header />
          <main>{children}</main>
          <Footer />
        </LayoutComponent>
      </StoreProvider>
    </html>
  )
}

export default RootLayout
