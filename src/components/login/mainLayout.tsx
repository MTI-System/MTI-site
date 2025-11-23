import { ReactNode } from "react"
import LogoWithTT from "../ui/LogoWithTT"
import Link from "next/link"

export default function LoginLayout({
  children,
  title,
  description,
}: {
  children: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center select-none">
      <div className="flex items-center justify-center">
        <div className="bg-bg-alt flex w-screen max-w-160 flex-col items-center justify-center gap-4 rounded-4xl px-16 py-14">
          <Link href="/" className="">
            <LogoWithTT logoSize="4rem" margin="">
              <h2 className="leading-none font-bold" style={{ fontSize: "4rem" }}>
                МТИ
              </h2>
            </LogoWithTT>
          </Link>
          <div className="border-border flex flex-col gap-2 rounded-2xl border py-5">
            <h2 className="text-text-main text-center text-3xl font-bold">{title}</h2>
            <p className="text-text-alt text-center text-lg font-medium">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
