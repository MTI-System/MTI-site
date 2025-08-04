import footerStyle from "@/styles/components/sections/app/footer.module.css"
import LogoWithTT from "@/components/sections/app/LogoWithTT"
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className={footerStyle.footer}>
        <div className={footerStyle.gridDiv}>
          <div className={footerStyle.mainBioFooter}>
            <LogoWithTT logoSize={"var(--main-header-text)"} margin={"-2vh"} />
            <p className={footerStyle.commonBioText}>
              © 2025 Менеджер Турнирной Информации МТИ
              <br />
              12345 Антарктида, Где то
            </p>
          </div>
          <ol className={footerStyle.leftFooterOl}>
            <li className={footerStyle.linkItem}><Link href="/about">О нас</Link></li>
            <li className={footerStyle.linkItem}>Telegram</li>
            <li className={footerStyle.linkItem}>ВКонтакте</li>
          </ol>
          <ol className={footerStyle.rightFooterOl}>
            <li className={footerStyle.linkItem}><Link href="/about">О нас</Link></li>
            <li className={footerStyle.linkItem}>Telegram</li>
            <li className={footerStyle.linkItem}>ВКонтакте</li>
          </ol>
        </div>
      </footer>
    </>
  )
}
