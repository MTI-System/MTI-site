import ClickableCard from "@/components/ui/ClickableCard"
import mainStyle from "@/styles/app/mainPage.module.css"
import { Button } from "@/components/ui/Buttons"
import clsx from "clsx"

export default function Home() {
  return (
    <div>
      {/*<video src={"https://files.mofius-server.ru/media/get/AQPUtp1tpdS06ThMCbWYoHohuk19_muVSo55Nqu5VSwfkPXd3SC2z_BTPcPFCDZ.mp4"} controls></video>*/}
      <div className={mainStyle.cardGrid}>
        <ClickableCard className={clsx(mainStyle.card, mainStyle.problems)} href="/problems">
          <div className={mainStyle.cardMainDiv}>
            <div>
              <p className={mainStyle.upHeaderDescription}>РАЗДЕЛ СО ВСЕМИ ЗАДАНИЯМИ</p>
              <h2 className={mainStyle.cardHeader}>Задачи</h2>
            </div>
            <div className={mainStyle.cardFooter}>
              <p className={mainStyle.footerText}>У нас новые задачи!</p>
              <Button className={mainStyle.footerButton}>Посмотреть</Button>
            </div>
          </div>
        </ClickableCard>
        <ClickableCard className={clsx(mainStyle.card, mainStyle.statistics)} href="/underconstruction">
          <div className={mainStyle.cardMainDiv}>
            <div>
              <p className={mainStyle.upHeaderDescription}>СТАТИСТИЧЕСКИЙ ГЕНЕРАТОР</p>
              <h2 className={mainStyle.cardHeader}>Статистика</h2>
            </div>
            <div className={mainStyle.cardFooter}>
              <p className={mainStyle.footerText}>Очень подробная статистика</p>
            </div>
          </div>
        </ClickableCard>
        {/* TODO: understand how to correctly merge classes in next.js style modules */}
        <ClickableCard
          className={clsx(mainStyle.card, mainStyle.tournaments, { [mainStyle.nosaved]: true })}
          href="/underconstruction"
        >
          <div className={mainStyle.cardMainDiv}>
            <div>
              <p className={mainStyle.upHeaderDescription}>ВСЕ, ЧТО НУЖНО ЗНАТЬ О ТУРНИРАХ</p>
              <h2 className={mainStyle.cardHeader}>Турниры</h2>
            </div>
            <div className={mainStyle.cardFooter}>
              <p className={mainStyle.footerText}>Скоро регистрация</p>
              <Button className={mainStyle.footerButton}>Следить</Button>
            </div>
          </div>
        </ClickableCard>
        {/* <ClickableCard className={mainStyle.savedTournament} href="/underconstruction">
        сохранённое
      </ClickableCard> */}
        <ClickableCard className={clsx(mainStyle.card, mainStyle.fights)} href="/underconstruction">
          <div>
            <p className={mainStyle.upHeaderDescription}>БЛИЖАЙШИЕ, ИДУЩИЕ, ПРОШЕДШИЕ</p>
            <h2 className={mainStyle.cardHeader}>Бои</h2>
          </div>
        </ClickableCard>
        <ClickableCard className={clsx(mainStyle.card, mainStyle.peoplem)} href="/underconstruction">
          <div>
            <p className={mainStyle.upHeaderDescription}>ВСЕ, КТО СВЯЗАН С ТУРНИРАМИ</p>
            <h2 className={mainStyle.cardHeader}>Люди</h2>
          </div>
        </ClickableCard>
        <ClickableCard className={clsx(mainStyle.card, mainStyle.forOrganizators)} href="/organization">
          <div>
            <p className={mainStyle.upHeaderDescription}>ЛИЧНЫЙ КАБИНЕТ</p>
            <h2 className={mainStyle.cardHeader}>Организаторам</h2>
          </div>
        </ClickableCard>
      </div>
    </div>
  )
}
