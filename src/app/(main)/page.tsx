import ClickableCard from "@/components/ui/ClickableCard"
import mainStyle from "@/styles/app/mainPage.module.css"

export default function Home() {
  return (
    <div>
      <h1>Менеджер Турнирной Информации</h1>
      <div className={mainStyle.cardGrid}>
        <ClickableCard className={mainStyle.problems} href="/problems">
          Задачи
        </ClickableCard>
        <ClickableCard className={mainStyle.statistics} href="/underconstruction">
          Статистика
        </ClickableCard>
        {/* TODO: understand how to correctly merge classes in next.js style modules */}
        <ClickableCard className={mainStyle.tournaments + " " + mainStyle.nosaved} href="/underconstruction">
          Турниры
        </ClickableCard>
        {/* <ClickableCard className={mainStyle.savedTournament} href="/underconstruction">
        сохранённое
      </ClickableCard> */}
        <ClickableCard className={mainStyle.fights} href="/underconstruction">
          Бои
        </ClickableCard>
        <ClickableCard className={mainStyle.people} href="/underconstruction">
          Люди
        </ClickableCard>
        <ClickableCard className={mainStyle.forOrganizators} href="/organization">
          Организаторам
        </ClickableCard>
      </div>
    </div>

  )
}
