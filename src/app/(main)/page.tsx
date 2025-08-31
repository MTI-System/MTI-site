import mainStyle from "@/styles//routes/(main)/mainPage.module.css"
import ClickableCard from "@/components/ui/ClickableCard"
import { Button } from "@/components/ui/Buttons"
import clsx from "clsx"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { MaskLineForMenuCard } from "@/components/main/MaskLineForCard"

export const metadata: Metadata = {
  title: {
    template: "МТИ",
    default: "МТИ - Менеджер Турнирной Информации",
  },
  description:
    "МТИ — единое пространство для научных турниров (ТЮФ, ТЮЕ): регистрация, сетки боёв, статистика, дипломы и история достижений в одном месте.",
  verification: {
    yandex: "aa838087dd1ef992",
  },
}

export default async function Home() {
  const cookie = await cookies()
  return (
    <div className="h-full">
      <div className="flex h-[50vh] min-h-[70rem] flex-col gap-5 py-10 sm:grid sm:min-h-[55rem] sm:grid-cols-3 sm:grid-rows-4 sm:gap-2">
        <ClickableCard
          className={`bg-bg-alt border-border relative flex h-[10rem] overflow-hidden border-[1px] transition-opacity hover:opacity-80 sm:row-[1/3] sm:h-auto`}
          href={`/problems`}
        >
          <div className="relative z-1 size-full">
            <div className="relative flex size-full flex-col justify-between">
              <div className="w-full pt-4 pl-5 sm:flex sm:flex-col sm:items-center sm:pl-0 md:items-start md:pl-5">
                <p className="text-text-alt font-bold sm:text-center md:text-start">РАЗДЕЛ СО ВСЕМИ ЗАДАНИЯМИ</p>
                <h2 className="text-text-main text-3xl font-bold">Задачи</h2>
              </div>
              <div className="bg-card-cta-bar border-t-border flex h-13 items-center justify-between border-t-[1px] px-4 backdrop-blur-[2px]">
                <p className="text-text-main text-[1rem] sm:text-[0.7rem] lg:text-[1rem]">У нас новые задачи!</p>
                <Button className="bg-accent-primary text-text-on-accent shadow-accent-primary h-[70%] w-fit rounded-full px-2 text-[1rem] shadow-[0_0_0_2px_var(--tw-shadow-color),0_0_30px_0_var(--tw-shadow-color)] transition-opacity hover:opacity-80 sm:text-[0.7rem] lg:text-[1rem]">
                  Посмотреть
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 hidden opacity-30 sm:block">
            <MaskLineForMenuCard
              className="ms-[1.5rem] h-[33%] bg-[#ED0F4E]"
              maskIcon={`${FILES_SERVER}problemMask.svg`}
            />
            <MaskLineForMenuCard
              className="ms-[-2rem] h-[33%] bg-[#ED0F4E]"
              maskIcon={`${FILES_SERVER}problemMask.svg`}
            />
            <MaskLineForMenuCard
              className="ms-[1.5rem] h-[33%] bg-[#ED0F4E]"
              maskIcon={`${FILES_SERVER}problemMask.svg`}
            />
          </div>
        </ClickableCard>
        <ClickableCard
          className={`bg-bg-alt border-border relative flex h-[10rem] overflow-hidden border-[1px] transition-opacity hover:opacity-80 sm:row-span-3 sm:h-auto md:row-span-3 lg:row-span-4`}
          href={`/tournaments`}
        >
          <div className="relative z-1 size-full">
            {" "}
            {/* Контейнер с относительным позиционированием */}
            <div className="relative flex size-full flex-col justify-between">
              {" "}
              {/* Добавляем relative */}
              <div className="w-full pt-4 pl-5 sm:flex sm:flex-col sm:items-center sm:pl-0 md:items-start md:pl-5">
                <p className="text-text-alt font-bold sm:text-center md:text-start">ВСЕ, ЧТО НУЖНО ЗНАТЬ О ТУРНИРАХ</p>
                <h2 className="text-text-main text-3xl font-bold">Турниры</h2>
              </div>
              <div className="bg-card-cta-bar border-t-border flex h-13 items-center justify-between border-t-[1px] px-4 backdrop-blur-[2px]">
                <p className="text-text-main text-1rem text-[1rem] sm:text-[0.7rem] lg:text-[1rem]">
                  Скоро регистрация
                </p>
                <Button className="bg-accent-primary text-text-on-accent shadow-accent-primary h-[70%] w-fit rounded-full px-2 text-[1rem] shadow-[0_0_0_2px_var(--tw-shadow-color),0_0_30px_0_var(--tw-shadow-color)] transition-opacity hover:opacity-80 sm:text-[0.7rem] lg:text-[1rem]">
                  Следить
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 hidden flex-col pt-8 opacity-50 sm:flex">
            <MaskLineForMenuCard
              className="bg-accent-primary z-0 ms-[-4rem] flex-[1]"
              maskIcon={`${FILES_SERVER}TournametnsMask.svg`}
            />
            <MaskLineForMenuCard
              className="bg-accent-primary ms-[-2rem] flex-[1]"
              maskIcon={`${FILES_SERVER}TournametnsMask.svg`}
            />
            <MaskLineForMenuCard
              className="bg-accent-primary ms-[-4rem] flex-[1]"
              maskIcon={`${FILES_SERVER}TournametnsMask.svg`}
            />
            <MaskLineForMenuCard
              className="bg-accent-primary ms-[-2rem] flex-[1]"
              maskIcon={`${FILES_SERVER}TournametnsMask.svg`}
            />
            <MaskLineForMenuCard
              className="bg-accent-primary ms-[-4rem] flex-[1]"
              maskIcon={`${FILES_SERVER}TournametnsMask.svg`}
            />
          </div>
        </ClickableCard>
        <ClickableCard
          className={`bg-bg-alt border-border relative flex h-[10rem] overflow-hidden border-[1px] transition-opacity hover:opacity-80 sm:row-span-2 sm:h-auto`}
          href={`/fights`}
        >
          <div className="relative z-1 size-full">
            <div className="relative flex size-full flex-col justify-between">
              <div className="w-full pt-4 pl-5 sm:flex sm:flex-col sm:items-center sm:pl-0 md:items-start md:pl-5">
                <p className="text-text-alt font-bold sm:text-center md:text-start">БЛИЖАЙШИЕ, ИДУЩИЕ, ПРОШЕДШИЕ</p>
                <h2 className="text-text-main text-3xl font-bold">Бои</h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 hidden pt-3 opacity-30 sm:block">
            <MaskLineForMenuCard
              className="ms-[1.5rem] h-[33%] bg-[#A020F0]"
              maskIcon={`${FILES_SERVER}FightsMask.svg`}
            />
            <MaskLineForMenuCard
              className="ms-[-2rem] h-[33%] bg-[#A020F0]"
              maskIcon={`${FILES_SERVER}FightsMask.svg`}
            />
            <MaskLineForMenuCard
              className="ms-[1.5rem] h-[33%] bg-[#A020F0]"
              maskIcon={`${FILES_SERVER}FightsMask.svg`}
            />
          </div>
        </ClickableCard>
        <ClickableCard
          className={`bg-bg-alt border-border relative flex h-[10rem] overflow-hidden border-[1px] transition-opacity hover:opacity-80 sm:h-auto`}
          href={`/peoples`}
        >
          <div className="relative z-1 size-full">
            <div className="relative flex size-full flex-col justify-between">
              <div className="w-full pt-4 pl-5 sm:flex sm:flex-col sm:items-center sm:pl-0 md:items-start md:pl-5">
                <p className="text-text-alt font-bold sm:text-center md:text-start">ВСЕ, КТО СВЯЗАН С ТУРНИРАМИ</p>
                <h2 className="text-text-main text-3xl font-bold">Люди</h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 hidden opacity-30 sm:block">
            <MaskLineForMenuCard
              iconH={50}
              iconW={100}
              className="ms-[1.5rem] h-[33%] bg-[#FFD300]"
              maskIcon={`${FILES_SERVER}PeoplesMask.svg`}
            />
            <MaskLineForMenuCard
              iconH={50}
              iconW={100}
              className="ms-[-2rem] h-[33%] bg-[#FFD300]"
              maskIcon={`${FILES_SERVER}PeoplesMask.svg`}
            />
            <MaskLineForMenuCard
              iconH={50}
              iconW={100}
              className="ms-[1.5rem] h-[33%] bg-[#FFD300]"
              maskIcon={`${FILES_SERVER}PeoplesMask.svg`}
            />
          </div>
        </ClickableCard>
        <ClickableCard
          className={`bg-bg-alt border-border relative flex h-[10rem] overflow-hidden border-[1px] transition-opacity hover:opacity-80 sm:row-[3/5] sm:h-auto`}
          href={`/stats`}
        >
          <div className="relative z-1 size-full">
            <div className="relative flex size-full flex-col justify-between">
              <div className="w-full pt-4 pl-5 sm:flex sm:flex-col sm:items-center sm:pl-0 md:items-start md:pl-5">
                <p className="text-text-alt font-bold sm:text-center md:text-start">СТАТИСТИЧЕСКИЙ ГЕНЕРАТОР</p>
                <h2 className="text-text-main text-3xl font-bold">Статистика</h2>
              </div>
              <div className="bg-card-cta-bar border-t-border flex h-13 items-center justify-between border-t-[1px] px-5 backdrop-blur-[2px]">
                <p className="text-text-main text-[1rem] sm:text-[0.7rem] lg:text-[1rem]">Очень подробная статистика</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 hidden opacity-30 sm:block">
            <MaskLineForMenuCard
              className="ms-[1.5rem] h-[33%] bg-[#32E875]"
              maskIcon={`${FILES_SERVER}StatsMask.svg`}
            />
            <MaskLineForMenuCard
              className="ms-[-2rem] h-[33%] bg-[#32E875]"
              maskIcon={`${FILES_SERVER}StatsMask.svg`}
            />
            <MaskLineForMenuCard
              className="ms-[1.5rem] h-[33%] bg-[#32E875]"
              maskIcon={`${FILES_SERVER}StatsMask.svg`}
            />
          </div>
        </ClickableCard>
        <ClickableCard
          className={`bg-bg-alt border-border relative flex h-[10rem] overflow-hidden border-[1px] transition-opacity hover:opacity-80 sm:col-span-2 sm:h-auto md:col-span-2 lg:col-span-1`}
          href={`/organizators`}
        >
          <div className="relative z-1 size-full">
            <div className="relative flex size-full flex-col justify-between">
              <div className="w-full pt-4 pl-5 sm:flex sm:flex-col sm:items-center sm:pl-0 md:items-start md:pl-5">
                <p className="text-text-alt font-bold sm:text-center md:text-start">ЛИЧНЫЙ КАБИНЕТ</p>
                <h2 className="text-text-main text-3xl font-bold">Организаторам</h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 hidden opacity-30 sm:block">
            <MaskLineForMenuCard
              iconH={50}
              iconW={100}
              className="ms-[1.5rem] h-[33%] bg-[#00C6FF]"
              maskIcon={`${FILES_SERVER}OrgsMenu.svg`}
            />
            <MaskLineForMenuCard
              iconH={50}
              iconW={100}
              className="ms-[-1rem] h-[33%] bg-[#00C6FF]"
              maskIcon={`${FILES_SERVER}OrgsMenu.svg`}
            />
            <MaskLineForMenuCard
              iconH={50}
              iconW={100}
              className="ms-[1.5rem] h-[33%] bg-[#00C6FF]"
              maskIcon={`${FILES_SERVER}OrgsMenu.svg`}
            />
          </div>
        </ClickableCard>
      </div>
    </div>
  )
}
