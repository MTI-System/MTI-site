import "@fontsource-variable/roboto-mono"
import "@fontsource-variable/roboto-flex"
import "@/styles/main.css"
import type { Metadata } from "next"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Script from "next/script"
import { cookies } from "next/headers"
import StoreProvider from "@/components/Redux/StoreProvider"
import LayoutComponent from "@/components/sections/app/Layout"
import ThemeUpdator from "@/components/service/ThemeUpdator"


export function generateMetadata(): Metadata {
  const titleText = "Вход в аккаунт · МТИ"
  const descriptionText = "Вход в аккаунт Менеджера Турнирной Информации"

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

export default async function Template({ children }: { children: React.ReactNode }) {
  const cookiesStore = await cookies()
  return (
    <html>
      <head>
        <link rel="icon" href="https://mtiyt.ru/favicon.ico" type="image/x-icon"/>
        <script defer src="https://metrika.mtiyt.ru/script.js" data-website-id="8e028138-b03c-4ba1-a1a1-1b00fff2e564"></script>
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
        token={cookiesStore.get("mtiyt_auth_token")?.value ?? ""}
      >
        <ThemeUpdator />
        <LayoutComponent>{children}</LayoutComponent>
      </StoreProvider>
    </html>
  )
}
