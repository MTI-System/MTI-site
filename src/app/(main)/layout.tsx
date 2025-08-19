import Footer from "@/components/main/Footer"
import Header from "@/components/main/Header"
import { ReactNode } from "react"
import AuthReduxUpdator from "@/components/Redux/AuthReduxUpdator";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <AuthReduxUpdator/>
      <main className="px-9 min-h-full sm:px-[2rem] lg:px-24 bg-bg-main">
        {children}
      </main>
      <Footer />
    </>
  )
}
