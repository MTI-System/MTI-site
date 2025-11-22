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
    <div className="bg-bg-main flex w-full justify-center pt-12 pb-12 max-sm:pt-0 max-sm:pb-0">
      <div className="bg-bg-alt relative w-[90vw] rounded-[5rem] px-[6vw] pt-12 pb-20 max-sm:min-h-full max-sm:w-full max-sm:rounded-none max-sm:pt-8">
        <h1 className="text-text-main pt-4 text-center text-5xl font-bold max-sm:pt-8 max-sm:text-3xl">
          Что такое МТИ?
        </h1>
        <p className="text-text-main w-full pt-4 text-justify indent-20 text-2xl whitespace-pre-line max-sm:indent-8 max-sm:text-lg">
          Менеджер Турнирной Информации (МТИ) — это единое пространство для людей, которые делают и любят научные
          турниры, такие как ТЮ<span style={{ color: "#1e2ede" }}>Ф</span> (Турнир Юных Физиков) и ТЮ
          <span style={{ color: "rgb(94, 225, 118)" }}>E</span> (Турнир Юных Естествоиспытателей). Мы создаём систему,
          где турнирная жизнь становится прозрачной и удобной: от регистрации и сеток боёв до статистики, дипломов и
          истории достижений. Наша цель — чтобы любая команда, жюри и оргкомитет могли работать в одном месте, без
          бесконечных таблиц и ручной рутины.
        </p>

        <h1 className="text-text-main pt-8 text-center text-5xl font-bold max-sm:pt-8 max-sm:text-3xl">Наша миссия</h1>
        <p className="text-text-main w-full pt-4 text-justify indent-20 text-2xl whitespace-pre-line max-sm:indent-8 max-sm:text-lg">
          Сегодня информация о турнирах разбросана по разным площадкам, процесс регистрации неудобен, а у организаторов
          много повторяющейся ручной работы: от генерации дипломов до сводных таблиц и рассадок. Командам приходится на
          каждом турнире ориентироваться по разным системам (От excel до отдельных турнирных платформ). Плюс, сложно
          сопоставлять статистику между разными турнирами и оценивать опыт кандидатов в команду. Мы решаем все эти боли
          «под одной крышей».
        </p>

        <h1 className="text-text-main pt-8 text-center text-5xl font-bold max-sm:pt-8 max-sm:text-3xl">Кто мы?</h1>
        <div className="flex pt-4 max-sm:flex-col">
          <div className="text-text-main px-[6vw] pt-4 text-justify text-xl">
            <p>
              Сергей — победитель Всероссийских и Сибирских турниров юных физиков в составе Бобров, программист с
              большим опытом (пишу физический и клиентский софт с 9 класса), студент НГУ.
            </p>
            {/* <img src="https://api.mtiyt.ru/files/get/Sergey.jpg" className="h-[50vh] pt-4 rounded-xl"/> */}
          </div>
          <div className="text-text-main px-[6vw] pt-4 text-justify text-xl">
            <p>
              Антон — победитель РосТЮФ-2024 и МосТЮФ-2023 в составе Буравчиков, в программировании с детства: от
              Scratch до микроконтроллеров, победитель хакатонов и конференций, сейчас учусь в РТУ МИРЭА.
            </p>
            {/* <img src="https://api.mtiyt.ru/files/get/Anton.jpg" className="h-[50vh] pt-4 rounded-xl"/> */}
          </div>
        </div>

        <div className="pt-8">
          <h1 className="text-text-main text-center text-5xl font-bold max-sm:pt-8 max-sm:text-3xl">
            В разработке также участвуют
          </h1>
          <ol className="text-text-main pt-4 text-center text-2xl max-sm:text-xl">
            <li>Анастасия Литвинова - Шеф маркетингового офиса</li>
            <li>Артем Голомолзин - SMM</li>
            <li>Федор Василенко - UI/UX дизайнер</li>
            <li>Соня Морозова - Дизайнер</li>
          </ol>
        </div>

        <h1 className="text-text-main pt-8 text-center text-5xl font-bold max-sm:pt-8 max-sm:text-3xl">
          Присоединяйтесь
        </h1>
        <p className="text-text-main w-full pt-4 text-justify indent-20 text-2xl whitespace-pre-line max-sm:indent-8 max-sm:text-lg">
          Мы будем рады обратной связи и помощи. Следите за обновлениями и пишите нам:
        </p>
        <p className="text-text-main pt-4 text-center text-2xl max-sm:text-xl">
          Telegram:{" "}
          <a href="https://t.me/mty_ypt" className="text-accent-primary hover:underline">
            Ссылка
          </a>{" "}
          VK:{" "}
          <a href="https://vk.com/mty_ypt" className="text-accent-primary hover:underline">
            Ссылка
          </a>
        </p>
      </div>
    </div>
  )
}
