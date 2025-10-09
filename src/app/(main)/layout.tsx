import Footer from "@/components/main/Footer"
import Header from "@/components/main/Header"
import { ReactNode } from "react"
import AuthReduxUpdator from "@/components/Redux/AuthReduxUpdator"
import AuthProviderWrapper from "@/api/auth/ClientWrapper"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <AuthProviderWrapper>
        <AuthReduxUpdator />
      </AuthProviderWrapper>

      <main className="bg-bg-main min-h-[90%] px-2 sm:px-[2rem] lg:px-10">
        {/*<iframe allow="camera; microphone; fullscreen; display-capture; autoplay" src="https://meet.jit.si/TestRoom123" className="w-full h-[100rem]"></iframe>*/}
        {children}
      </main>
      <Footer />
    </>
  )
}
