import footerStyle from "@/styles/components/sections/app/footer.module.css"
import LogoWithTT from "@/components/sections/app/LogoWithTT"

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
            <li className={footerStyle.linkItem}>Профиль</li>
            <li className={footerStyle.linkItem}>Задачи</li>
            <li className={footerStyle.linkItem}>Турниры</li>
          </ol>
          <ol className={footerStyle.rightFooterOl}>
            <li className={footerStyle.linkItem}>Бои</li>
            <li className={footerStyle.linkItem}>Люди</li>
            <li className={footerStyle.linkItem}>Статистика</li>
          </ol>
        </div>
      </footer>
    </>
  )
}
