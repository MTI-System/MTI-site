import Footer from "@/components/main/Footer"
import Header from "@/components/main/Header"
import {ReactNode} from "react"
import AuthReduxUpdator from "@/components/Redux/AuthReduxUpdator"
import AuthProviderWrapper from "@/api/auth/ClientWrapper"
import {SnowfallProvider, Snowfall} from "@hdcodedev/snowfall";

export default function MainLayout({children}: { children: ReactNode }) {
  return (
    <>
      <SnowfallProvider>

        <Header/>
        <Snowfall/>
        <main className="bg-bg-main min-h-[90%] pb-2 px-2 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 -z-2"
              data-snowfall="ignore">{children}</main>


        <AuthProviderWrapper>
          <AuthReduxUpdator/>
        </AuthProviderWrapper>
        a


        <Footer/>
      </SnowfallProvider>
    </>
  )
}
