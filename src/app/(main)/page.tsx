import ClickableCard from "@/components/ui/ClickableCard"
import {Button} from "@/components/ui/Buttons"
import type {Metadata} from "next";
import {cookies} from "next/headers";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import {MaskLineForMenuCard} from "@/components/main/MaskLineForCard";

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

export default async function Home() {
  const cookie = await cookies()
  const clickableCardStyle = "flex hover:opacity-80 transition-opacity relative h-[10rem] sm:h-auto bg-bg-alt"
  return (
    <div className="flex flex-col min-h-[70rem] sm:min-h-[55rem] h-[100vh] gap-5 sm:gap-2 py-10 sm:grid sm:grid-cols-3 sm:grid-rows-4">
        <ClickableCard className={`${clickableCardStyle} sm:row-[1/3] overflow-hidden border-border border-[1px]`} href={`/problems`}>
          <div className="relative z-10 size-full"> {/* Контейнер с относительным позиционированием */}
            <div className="z-10 flex flex-col justify-between size-full relative"> {/* Добавляем relative */}
              <div className="w-full pl-5 sm:pl-0 md:pl-5 pt-4 sm:flex sm:flex-col  sm:items-center md:items-start">
                <p className="font-bold text-text-alt sm:text-center md:text-start">РАЗДЕЛ СО ВСЕМИ ЗАДАНИЯМИ</p>
                <h2 className="font-bold text-text-main text-3xl">Задачи</h2>
              </div>
              <div
                className="flex h-13 justify-between bg-card-cta-bar items-center px-4 backdrop-blur-[2px] border-t-border border-t-[1px]">
                <p className="text-text-main text-[1rem] sm:text-[0.7rem] lg:text-[1rem]">У нас новые задачи!</p>
                <Button
                  className=" bg-accent-primary rounded-full text-text-on-accent
                  hover:opacity-80 transition-opacity h-[70%]
                  shadow-[0_0_0_2px_var(--tw-shadow-color),0_0_30px_0_var(--tw-shadow-color)]
                  shadow-accent-primary w-fit text-[1rem] sm:text-[0.7rem] lg:text-[1rem] px-2">Посмотреть</Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-30 hidden sm:block">
            <MaskLineForMenuCard className="bg-[#ED0F4E] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}problemMask.svg`}/>
            <MaskLineForMenuCard className="bg-[#ED0F4E] h-[33%] ms-[-2rem]"
                                 maskIcon={`${FILES_SERVER}problemMask.svg`}/>
            <MaskLineForMenuCard className="bg-[#ED0F4E] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}problemMask.svg`}/>
          </div>

        </ClickableCard>
        <ClickableCard className={`${clickableCardStyle} sm:row-span-3 md:row-span-3 lg:row-span-4  overflow-hidden border-border border-[1px]`} href={`/tournaments`}>
          <div className="relative z-10 size-full"> {/* Контейнер с относительным позиционированием */}
            <div className="z-10 flex flex-col justify-between size-full relative"> {/* Добавляем relative */}

                            <div className="w-full pl-5 sm:pl-0 md:pl-5 pt-4 sm:flex sm:flex-col  sm:items-center md:items-start">
                <p className="font-bold text-text-alt sm:text-center md:text-start">ВСЕ, ЧТО НУЖНО ЗНАТЬ О ТУРНИРАХ</p>
                <h2 className="font-bold text-text-main text-3xl">Турниры</h2>
              </div>

              <div
                className="flex h-13 justify-between bg-card-cta-bar items-center px-4 backdrop-blur-[2px] border-t-border border-t-[1px]">
                <p className="text-text-main text-1rem text-[1rem] sm:text-[0.7rem] lg:text-[1rem]">Скоро регистрация</p>
                <Button
                  className=" bg-accent-primary rounded-full text-text-on-accent
                  hover:opacity-80 transition-opacity h-[70%]
                  shadow-[0_0_0_2px_var(--tw-shadow-color),0_0_30px_0_var(--tw-shadow-color)]
                  shadow-accent-primary w-fit text-[1rem] sm:text-[0.7rem] lg:text-[1rem] px-2">Следить</Button>
              </div>
            </div>
          </div>
          <div className="absolute flex-col inset-0 z-0 pt-8 opacity-50 hidden sm:flex">
            <MaskLineForMenuCard className="bg-accent-primary flex-[1] ms-[-4rem]"
                                 maskIcon={`${FILES_SERVER}TournametnsMask.svg`}/>
            <MaskLineForMenuCard className="bg-accent-primary flex-[1] ms-[-2rem]"
                                 maskIcon={`${FILES_SERVER}TournametnsMask.svg`}/>
            <MaskLineForMenuCard className="bg-accent-primary flex-[1] ms-[-4rem]"
                                 maskIcon={`${FILES_SERVER}TournametnsMask.svg`}/>
            <MaskLineForMenuCard className="bg-accent-primary flex-[1] ms-[-2rem]"
                                 maskIcon={`${FILES_SERVER}TournametnsMask.svg`}/>
            <MaskLineForMenuCard className="bg-accent-primary flex-[1] ms-[-4rem]"
                                 maskIcon={`${FILES_SERVER}TournametnsMask.svg`}/>
          </div>
        </ClickableCard>
        <ClickableCard className={`${clickableCardStyle} sm:row-span-2 overflow-hidden border-border border-[1px]`} href={`/fights`}>
          <div className="relative z-10 size-full"> {/* Контейнер с относительным позиционированием */}
            <div className="z-10 flex flex-col justify-between size-full relative"> {/* Добавляем relative */}
              <div className="w-full pl-5 sm:pl-0 md:pl-5 pt-4 sm:flex sm:flex-col  sm:items-center md:items-start">
                <p className="font-bold text-text-alt sm:text-center md:text-start">БЛИЖАЙШИЕ, ИДУЩИЕ, ПРОШЕДШИЕ</p>
                <h2 className="font-bold text-text-main text-3xl">Бои</h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pt-3 z-0 opacity-30 hidden sm:block">
            <MaskLineForMenuCard className="bg-[#A020F0] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}FightsMask.svg`}/>
            <MaskLineForMenuCard className="bg-[#A020F0] h-[33%] ms-[-2rem]" maskIcon={`${FILES_SERVER}FightsMask.svg`}/>
            <MaskLineForMenuCard className="bg-[#A020F0] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}FightsMask.svg`}/>
          </div>
        </ClickableCard>
        <ClickableCard className={`${clickableCardStyle} overflow-hidden border-border border-[1px]`} href={`/peoples`}>
          <div className="relative z-10 size-full"> {/* Контейнер с относительным позиционированием */}
            <div className="z-10 flex flex-col justify-between size-full relative"> {/* Добавляем relative */}
              <div className="w-full pl-5 sm:pl-0 md:pl-5 pt-4 sm:flex sm:flex-col  sm:items-center md:items-start">
                <p className="font-bold text-text-alt sm:text-center md:text-start">ВСЕ, КТО СВЯЗАН С ТУРНИРАМИ</p>
                <h2 className="font-bold text-text-main text-3xl">Люди</h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-30 hidden sm:block">
            <MaskLineForMenuCard iconH={50} iconW={100}  className="bg-[#FFD300] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}PeoplesMask.svg`}/>
            <MaskLineForMenuCard iconH={50} iconW={100}  className="bg-[#FFD300] h-[33%] ms-[-2rem]" maskIcon={`${FILES_SERVER}PeoplesMask.svg`}/>
            <MaskLineForMenuCard iconH={50} iconW={100}  className="bg-[#FFD300] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}PeoplesMask.svg`}/>
          </div>
        </ClickableCard>
        <ClickableCard className={`${clickableCardStyle} sm:row-[3/5] overflow-hidden border-border border-[1px]`} href={`/stats`}>
          <div className="relative z-10 size-full"> {/* Контейнер с относительным позиционированием */}
            <div className="z-10 flex flex-col justify-between size-full relative"> {/* Добавляем relative */}
              <div className="w-full pl-5 sm:pl-0 md:pl-5 pt-4 sm:flex sm:flex-col  sm:items-center md:items-start">
                <p className="font-bold text-text-alt sm:text-center md:text-start">СТАТИСТИЧЕСКИЙ ГЕНЕРАТОР</p>
                <h2 className="font-bold text-text-main text-3xl">Статистика</h2>
              </div>
              <div
                className="flex h-13 justify-between bg-card-cta-bar items-center px-5 backdrop-blur-[2px] border-t-border border-t-[1px]">
                <p className="text-text-main text-[1rem] sm:text-[0.7rem] lg:text-[1rem]">Очень подробная статистика</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-30 hidden sm:block">
            <MaskLineForMenuCard className="bg-[#32E875] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}StatsMask.svg`}/>
            <MaskLineForMenuCard className="bg-[#32E875] h-[33%] ms-[-2rem]" maskIcon={`${FILES_SERVER}StatsMask.svg`}/>
            <MaskLineForMenuCard className="bg-[#32E875] h-[33%] ms-[1.5rem]"
                                 maskIcon={`${FILES_SERVER}StatsMask.svg`}/>
          </div>
        </ClickableCard>
        <ClickableCard className={`${clickableCardStyle} sm:col-span-2 md:col-span-2 lg:col-span-1 overflow-hidden border-border border-[1px]`} href={`/organizators`}>
          <div className="relative z-10 size-full"> {/* Контейнер с относительным позиционированием */}
            <div className="z-10 flex flex-col justify-between size-full relative"> {/* Добавляем relative */}
              <div className="w-full pl-5 sm:pl-0 md:pl-5 pt-4 sm:flex sm:flex-col  sm:items-center md:items-start">
                <p className="font-bold text-text-alt sm:text-center md:text-start">ЛИЧНЫЙ КАБИНЕТ</p>
                <h2 className="font-bold text-text-main text-3xl">Организаторам</h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-30 hidden sm:block">
            <MaskLineForMenuCard iconH={50} iconW={100} className="bg-[#00C6FF] h-[33%] ms-[1.5rem]" maskIcon={`${FILES_SERVER}OrgsMenu.svg`}/>
            <MaskLineForMenuCard iconH={50} iconW={100} className="bg-[#00C6FF] h-[33%] ms-[-1rem]" maskIcon={`${FILES_SERVER}OrgsMenu.svg`}/>
            <MaskLineForMenuCard iconH={50} iconW={100} className="bg-[#00C6FF] h-[33%] ms-[1.5rem]" maskIcon={`${FILES_SERVER}OrgsMenu.svg`}/>
          </div>
        </ClickableCard>
      </div>

  )
}
