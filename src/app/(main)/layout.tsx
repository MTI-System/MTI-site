import Footer from "@/components/sections/app/Footer"
import Header from "@/components/sections/app/Header"
import { ReactNode } from "react"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
