import Footer from "@/components/sections/app/Footer"
import Header from "@/components/sections/app/Header"
import { ReactNode } from "react"
import AuthReduxUpdator from "@/components/service/AuthReduxUpdator";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <AuthReduxUpdator/>
      <main>{children}</main>
      <Footer />
    </>
  )
}
