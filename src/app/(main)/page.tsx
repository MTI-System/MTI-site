import ClickableCard from "@/components/ui/ClickableCard"
import mainStyle from "@/styles/app/mainPage.module.css"
import {store} from "next/dist/build/output/store";
import {Button} from "@/components/ui/Buttons";

export default function Home() {

  return (
    <div>
      <div className={mainStyle.cardGrid}>
        <ClickableCard className={mainStyle.problems} href="/problems">
          <div className={mainStyle.cardMainDiv}>
            <h2 className={mainStyle.cardHeader}>Задачи</h2>
            <div className={mainStyle.cardFooter}>
              <p className={mainStyle.footerText}>У нас новые задачи!</p>
              <Button className={mainStyle.footerButton}>Посмотреть</Button>
            </div>
          </div>
        </ClickableCard>
        <ClickableCard className={mainStyle.statistics} href="/underconstruction">
          <div className={mainStyle.cardMainDiv}>
            <h2 className={mainStyle.cardHeader}>Статистика</h2>
            <div className={mainStyle.cardFooter}>
              <p className={mainStyle.footerText}>Очень подробная статистика</p>
            </div>
          </div>

        </ClickableCard>
        {/* TODO: understand how to correctly merge classes in next.js style modules */}
        <ClickableCard className={mainStyle.tournaments + " " + mainStyle.nosaved} href="/underconstruction">

          <div className={mainStyle.cardMainDiv}>
            <h2 className={mainStyle.cardHeader}>Турниры</h2>
            <div className={mainStyle.cardFooter}>
              <p className={mainStyle.footerText}>Скоро регистрация</p>
              <Button className={mainStyle.footerButton}>Следить</Button>
            </div>
          </div>
        </ClickableCard>
        {/* <ClickableCard className={mainStyle.savedTournament} href="/underconstruction">
        сохранённое
      </ClickableCard> */}
        <ClickableCard className={mainStyle.fights} href="/underconstruction">
          <h2 className={mainStyle.cardHeader}>Бои</h2>
        </ClickableCard>
        <ClickableCard className={mainStyle.people} href="/underconstruction">
          <h2 className={mainStyle.cardHeader}>Люди</h2>
        </ClickableCard>
        <ClickableCard className={mainStyle.forOrganizators} href="/organization">
          <h2 className={mainStyle.cardHeader}>Организаторам</h2>
        </ClickableCard>
      </div>
    </div>

  )
}
