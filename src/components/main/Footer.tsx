import footerStyle from "@/styles/components/sections/app/footer.module.css"
import LogoWithTT from "@/components/ui/LogoWithTT"
import Link from "next/link"

export default function Footer() {
  return (
    <>
      <footer className="bg-bg-alt">
        <div className="text-text-main flex flex-row items-center justify-between sm:px-32">
          <div className="flex gap-4">
            {/*<LogoWithTT logoSize={"var(--main-header-text)"} margin={"-2vh"}>*/}
            {/*  <h2 className="" style={{ fontSize: "var(--main-header-text)" }}>*/}
            {/*    МТИ*/}
            {/*  </h2>*/}
            {/*</LogoWithTT>*/}
            <p className={footerStyle.commonBioText}>
              © 2025 Менеджер Турнирной Информации МТИ
              <br />
            </p>
          </div>
          <ol className={footerStyle.rightFooterOl}>
            <li className={footerStyle.linkItem}>
              <Link href="/about">О нас</Link>
            </li>
            <li className={footerStyle.linkItem}>
              <Link href="https://t.me/mty_ypt">Telegram</Link>
            </li>
            <li className={footerStyle.linkItem}>
              <Link href="https://vk.com/mty_ypt">ВКонтакте</Link>
            </li>
          </ol>
        </div>
      </footer>
    </>
  )
}
