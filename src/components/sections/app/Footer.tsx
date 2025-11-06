import footerStyle from "@/styles/components/sections/app/footer.module.css"
import LogoWithTT from "@/components/sections/app/LogoWithTT"
import Link from "next/link"
import {FILES_SERVER} from "@/constants/APIEndpoints";

export default function Footer() {
  return (
    <>
      <footer className={footerStyle.footer}>
        <div className={footerStyle.gridDiv}>
          <div className={footerStyle.mainBioContainer}>
            <div className={footerStyle.mainBioFooter}>
              <LogoWithTT logoSize={"var(--main-header-text)"} margin={"-2vh"}>
                <h2 className={footerStyle.mainBioHeaderText} style={{ fontSize: "var(--main-header-text)" }}>
                  МТИ
                </h2>
              </LogoWithTT>
              <p className={footerStyle.commonBioText}>
                © 2025 Менеджер Турнирной Информации МТИ
                <br />
              </p>
            </div>
            <div className={footerStyle.parthnerContainer}>
              <p>При финансовой поддержке</p>
              <a href={"https://luptakov.ru/"}>
                <div
                  style={{
                    width: 200,
                    height: 80,
                    backgroundColor: "var(--main-text-color)", // ← меняйте цвет тут
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


          <ol className={footerStyle.leftFooterOl}>
          </ol>
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
