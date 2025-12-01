import footerStyle from "@/styles/components/sections/app/footer.module.css"
import LogoWithTT from "@/components/ui/LogoWithTT"
import Link from "next/link"
import { FILES_SERVER } from "@/constants/APIEndpoints";

export default function Footer() {
  const leftCol = [
    { id: 1, label: 'О нас', href: "/about" },
    { id: 2, label: 'Telegram', href: "https://t.me/mty_ypt" },
    { id: 3, label: 'ВКонтакте', href: "https://vk.com/mty_ypt" }
  ];
  const rightCol = [
    { id: 1, label: 'FAQ', href: "" },
    { id: 2, label: 'Контакты', href: "" },
    { id: 3, label: 'Помощь', href: "" }
  ];
  return (
    <>
      <footer className="bg-bg-alt p-5">
        <div className="text-text-alt text-base flex flex-col gap-5 px-14 lg:flex-row items-center justify-between lg:px-[6vw]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
              {<LogoWithTT logoSize={"36px"} margin={"-6px"}>
                <h2 className="text-text-main font-bold text-4xl">
                  МТИ
                </h2>
              </LogoWithTT>}
              <div className="flex flex-col pt-3 gap-1">
                <p className="self-start">
                  © 2025 Менеджер Турнирной Информации МТИ
                </p>
                <div className="flex items-center gap-3">
                  <p>
                    При финансовой поддержке
                  </p>
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
                    >
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-[6vw] lg:gap-[10vw]">
            <ul className="text-xl">
              {leftCol.map(item => (
                <li key={item.id}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <ul className="text-xl">
              {rightCol.map(item => (
                <li key={item.id}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div >
      </footer >
    </>
  )
}
