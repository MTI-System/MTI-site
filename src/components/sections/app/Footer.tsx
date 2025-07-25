import footerStyle from "@/styles/app/footer.module.css";
import LogoWithTT from "@/components/sections/app/LogoWithTT";

export default function Footer() {
  return (
    <>
      <footer className={footerStyle.footer}>
        <div className={footerStyle.gridDiv}>
          <div className={footerStyle.mainBioFooter}>
            <LogoWithTT logoSize={"var(--main-header-text)"} margin={"-2vh"}/>
            <p className={footerStyle.commonBioText}>© 2025 Менеджер Турнирной Информации МТИ<br/>
              12345 Антарктида, Где то</p>

          </div>
          <ol className={footerStyle.footerOl}>
            <li className={footerStyle.linkItem}>Политика</li>
            <li className={footerStyle.linkItem}>Контакты</li>
            <li className={footerStyle.linkItem}>Помощь</li>
          </ol>
          <ol className={footerStyle.footerOl}>
            <li className={footerStyle.linkItem}>FAQ</li>
            <li className={footerStyle.linkItem}>Аккаунт</li>
            <li className={footerStyle.linkItem}>Что-то</li>
          </ol>

        </div>
      </footer>
    </>
  )
}