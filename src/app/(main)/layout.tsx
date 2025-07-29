import "@/styles/app/main.css"
import type { Metadata } from "next"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import Script from "next/script"
import StoreProvider from "@/components/Redux/StoreProvider"
import Header from "@/components/sections/app/Header"
import Footer from "@/components/sections/app/Footer"
import { cookies } from "next/headers"
import LayoutComponent from "@/components/sections/app/Layout"



async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <>
        <LayoutComponent>
          <Header/>
          <main>{children}</main>
          <Footer />
        </LayoutComponent>
      </>
  )
}

export default RootLayout
