import style from "@/styles/components/sections/app/about.module.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "О МТИ",
    default: "О Менеджере Турнирной Информации",
  },
  description:
    "Страница с информацией, на которой вы можете узнать о то, что такое МТИ (Система для проведения научных турниров, такие как ТЮФ и ТЮЕ)",
  verification: {
    yandex: "aa838087dd1ef992",
  },
}

export default function AboutPage() {
  return (
    <div className={style.mainContainer}>
      <div className={style.mainInfoBlock}>
        <h1 className={style.headerStyle}>Что такое МТИ?</h1>
        <p className={style.textStyle}>
          Менеджер Турнирной Информации (МТИ) — это единое пространство для людей, которые делают и любят научные
          турниры, такие как ТЮ<span style={{ color: "#1e2ede" }}>Ф</span> (Турнир Юных Физиков) и ТЮ
          <span style={{ color: "rgb(94, 225, 118)" }}>E</span> (Турнир Юных Естествоиспытателей). Мы создаём систему,
          где турнирная жизнь становится прозрачной и удобной: от регистрации и сеток боёв до статистики, дипломов и
          истории достижений. Наша цель — чтобы любая команда, жюри и оргкомитет могли работать в одном месте, без
          бесконечных таблиц и ручной рутины.
        </p>
        <h1 className={style.headerStyle}>Наша миссия</h1>
        <p className={style.textStyle}>
          Сегодня информация о турнирах разбросана по разным площадкам, процесс регистрации неудобен, а у организаторов
          много повторяющейся ручной работы: от генерации дипломов до сводных таблиц и рассадок. Командам приходится на
          каждом турнире ориентироваться по разным системам (От excel до отдельных турнирных платформ). Плюс, сложно
          сопоставлять статистику между разными турнирами и оценивать опыт кандидатов в команду. Мы решаем все эти боли
          «под одной крышей».
        </p>
        <h1 className={style.headerStyle}>Кто мы?</h1>
        <div className={style.teamBioContainer}>
          <div className={style.personContainer}>
            <p>
              Сергей — победитель Всероссийских и Сибирских турниров юных физиков в составе Бобров, программист с
              большим опытом (пишу физический и клиентский софт с 9 класса), студент НГУ.
            </p>
            {/* <img src="https://api.mtiyt.ru/files/get/Sergey.jpg" className={style.imageStyle}/> */}
          </div>
          <div className={style.personContainer}>
            <p>
              Антон — победитель РосТЮФ-2024 и МосТЮФ-2023 в составе Буравчиков, в программировании с детства: от
              Scratch до микроконтроллеров, победитель хакатонов и конференций, сейчас учусь в РТУ МИРЭА.
            </p>
            {/* <img src="https://api.mtiyt.ru/files/get/Anton.jpg" className={style.imageStyle}/> */}
          </div>
        </div>
        <div>
          <h1 className={style.headerStyle}>В разработке также участвуют</h1>
          <ol className={style.personsList}>
            <li>Артем Голомолзин - SMM</li>
            <li>Федор Василенко - UI/UX дизайнер</li>
            <li>Соня Морозова - Дизайнер</li>
          </ol>
        </div>
        <h1 className={style.headerStyle}>Присоединяйтесь</h1>
        <p className={style.textStyle}>Мы будем рады обратной связи и помощи. Следите за обновлениями и пишите нам:</p>
        <p className={style.personsList}>
          Telegram: <a href="https://t.me/mty_ypt">Ссылка</a> VK: <a href="https://vk.com/mty_ypt">Ссылка</a>
        </p>
      </div>
    </div>
  )
}
