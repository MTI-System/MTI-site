import footerStyle from "@/styles/components/sections/app/footer.module.css"
import LogoWithTT from "@/components/ui/LogoWithTT"
import Link from "next/link"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { cookies } from "next/headers"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import ColoredTType from "@/components/ui/ColoredTType"

export default async function Footer() {
  const leftCol = [
    { id: 1, label: "GitHub", href: "https://github.com/MTI-System/MTI-site" },
    { id: 2, label: "Telegram", href: "https://t.me/mty_ypt" },
    { id: 3, label: "ВКонтакте", href: "https://vk.com/mty_ypt" },
  ]
  const rightCol = [
    { id: 1, label: "Соглашение", href: `${FILES_SERVER}Privacy Policy.pdf` },
    { id: 2, label: "", href: "" },
    { id: 3, label: "О нас", href: "/about" },
  ]

  const initTT = (await cookies()).get("mtiyt_tournamentType")?.value ?? "1"
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}))
  const { data: tournamentTypes } = await promise
  const currentTT = tournamentTypes?.find((tt) => tt.id === Number(initTT))
  return (
    <>
      <footer className="bg-bg-alt p-5">
        <div className="text-text-alt flex flex-col items-center justify-between gap-5 px-14 text-base lg:flex-row lg:px-[6vw]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
              <div className="text-text-main flex flex-col items-center text-3xl font-bold">
                <span>МТИ</span>
                <ColoredTType ttName={currentTT?.name ?? "ТЮФ"} ttColor={currentTT?.color ?? "#000000"} />
              </div>

              <div className="flex flex-col gap-1 pt-3">
                <p className="self-start">© 2025 Менеджер Турнирной Информации МТИ</p>
                <div className="flex items-center gap-3">
                  <p>При финансовой поддержке</p>
                  <a href="https://luptakov.ru/">
                    <div
                      style={{
                        width: 160,
                        height: 40,
                        backgroundColor: "var(--color-text-main)",
                        WebkitMaskImage: `url(${FILES_SERVER + "parthner_logo_light.svg"})`,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskImage: `url(${FILES_SERVER + "parthner_logo_light.svg"})`,
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        maskSize: "contain",
                        display: "inline-block",
                      }}
                    ></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-[6vw] lg:gap-[10vw]">
            <ul className="text-xl">
              {leftCol.map((item) => (
                <li key={item.id}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <ul className="text-xl">
              {rightCol.map((item) => (
                <li key={item.id}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
