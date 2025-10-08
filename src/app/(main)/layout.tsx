import Footer from "@/components/main/Footer"
import Header from "@/components/main/Header"
import { ReactNode } from "react"
import AuthReduxUpdator from "@/components/Redux/AuthReduxUpdator";
import AuthProviderWrapper from "@/api/auth/ClientWrapper";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <AuthProviderWrapper>
          <AuthReduxUpdator/>
      </AuthProviderWrapper>

      <main className="px-2 min-h-[90%] sm:px-[2rem] lg:px-10 bg-bg-main">
          {/*<iframe allow="camera; microphone; fullscreen; display-capture; autoplay" src="https://meet.jit.si/TestRoom123" className="w-full h-[100rem]"></iframe>*/}
        {children}
      </main>
      <Footer />
    </>
  )
}
