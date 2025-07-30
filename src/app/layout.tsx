import "@fontsource-variable/roboto-mono"
import "@fontsource-variable/roboto-flex"
import "@/styles/routes/(main)/main.css"
import type { Metadata } from "next"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Script from "next/script"
import { cookies } from "next/headers"
import StoreProvider from "@/components/Redux/StoreProvider"
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

export default async function Template({ children }: { children: React.ReactNode }) {
  const cookiesStore = await cookies()
  console.log(cookiesStore.get("mtiyt_tournamentType")?.value ?? "undef")
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
      <StoreProvider
        tt={cookiesStore.get("mtiyt_tournamentType")?.value ?? "ТЮФ"}
        theme={cookiesStore.get("theme")?.value ?? "light"}
      >
        <LayoutComponent>{children}</LayoutComponent>
      </StoreProvider>
    </html>
  )
}
