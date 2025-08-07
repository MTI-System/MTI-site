import mainStyle from "@/styles//routes/(main)/mainPage.module.css"
import ClickableCard from "@/components/ui/ClickableCard"
import { Button } from "@/components/ui/Buttons"
import clsx from "clsx"
import UnlockTournamentType from "@/components/Redux/UnlockTournamentType"
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: {
    template: "МТИ",
    default: "МТИ - Менеджер Турнирной Информации",
  },
  description: "МТИ — единое пространство для научных турниров (ТЮФ, ТЮЕ): регистрация, сетки боёв, статистика, дипломы и история достижений в одном месте.",
  verification: {
    yandex: "aa838087dd1ef992",
  },
}

export default function Home() {
  return (
    <div style={{marginBottom: "1rem"}}>
      <UnlockTournamentType />
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
        <ClickableCard
          className={clsx(mainStyle.card, mainStyle.statistics, mainStyle.underConstruction)}
          href="/"
        >
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
          className={clsx(mainStyle.card, mainStyle.tournaments, mainStyle.underConstruction, {
            [mainStyle.nosaved]: true,
          })}
          href="/"
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
        <ClickableCard
          className={clsx(mainStyle.card, mainStyle.fights, mainStyle.underConstruction)}
          href="/"
        >
          <div>
            <p className={mainStyle.upHeaderDescription}>БЛИЖАЙШИЕ, ИДУЩИЕ, ПРОШЕДШИЕ</p>
            <h2 className={mainStyle.cardHeader}>Бои</h2>
          </div>
        </ClickableCard>
        <ClickableCard
          className={clsx(mainStyle.card, mainStyle.peoplem, mainStyle.underConstruction)}
          href="/"
        >
          <div>
            <p className={mainStyle.upHeaderDescription}>ВСЕ, КТО СВЯЗАН С ТУРНИРАМИ</p>
            <h2 className={mainStyle.cardHeader}>Люди</h2>
          </div>
        </ClickableCard>
        <ClickableCard
          className={clsx(mainStyle.card, mainStyle.forOrganizators, mainStyle.underConstruction)}
          href="/"
        >
          <div>
            <p className={mainStyle.upHeaderDescription}>ЛИЧНЫЙ КАБИНЕТ</p>
            <h2 className={mainStyle.cardHeader}>Организаторам</h2>
          </div>
        </ClickableCard>
      </div>
    </div>
  )
}
