"use client"
import style from "@/styles/routes/(main)/profile/profilePage.module.css"
import { User } from "@/types/authApi"
import { Right } from "@/types/authApi"
import { useRouter } from "next/navigation"
import cookies from "js-cookie"
import { useAppDispatch } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { setAuth } from "@/redux_stores/Global/AuthSlice"
import { Button, HoldButton } from "@/components/ui/Buttons"
import { useTransition } from "react"
import { Tabs } from "@base-ui-components/react"
import { FILES_SERVER } from "@/constants/APIEndpoints"

export default function ProfileMainPage({ profileData }: { profileData: User }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className={"text-text-main flex w-full justify-center py-2"}>
      <div className={"bg-bg-alt flex w-full flex-col items-center justify-center rounded-2xl py-5"}>
        <h1 className={"text-center text-3xl font-bold"}>Добро пожаловать, {profileData?.username}!</h1>
        <p className={"py-5 text-center"}>Ниже представлены разделы с инструкциями в зависимости от вашей роли.</p>
        <div className={"min-h-[50vh] w-full px-2 py-5 md:px-10"}>
          <Tabs.Root
            orientation="horizontal"
            className="border-border size-full rounded-md border"
            defaultValue="player"
          >
            <Tabs.List className="shadow-border relative z-0 flex gap-1 overflow-x-auto px-2 shadow-[inset_0_-1px]">
              <Tabs.Tab
                className="text-text-alt before:outline-accent-primary hover:text-text-main data-active:text-text-main flex h-8 flex-1 cursor-pointer items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2"
                value="player"
              >
                Участник
              </Tabs.Tab>
              <Tabs.Tab
                className="text-text-alt before:outline-accent-primary hover:text-text-main data-active:text-text-main flex h-8 flex-1 cursor-pointer items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline"
                value="trainer"
              >
                Тренер команды
              </Tabs.Tab>
              <Tabs.Tab
                className="text-text-alt before:outline-accent-primary hover:text-text-main data-active:text-text-main pointer-events-none flex h-8 flex-1 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2"
                value="jury"
              >
                Жюри
              </Tabs.Tab>
              <Tabs.Tab
                className="text-text-alt before:outline-accent-primary hover:text-text-main data-active:text-text-main flex h-8 flex-1 cursor-pointer items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline"
                value="organizators"
              >
                Организатор
              </Tabs.Tab>
              <Tabs.Tab
                className="text-text-alt before:outline-accent-primary hover:text-text-main data-active:text-text-main pointer-events-none flex h-8 flex-1 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2"
                value="moderator"
              >
                Модератор
              </Tabs.Tab>
              <Tabs.Indicator className="dark:bg-border absolute top-1/2 left-0 -z-1 h-6 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-sm bg-gray-100 transition-all duration-200 ease-in-out" />
            </Tabs.List>
            <Tabs.Panel
              className="outline-accent-primary relative flex h-fit items-center justify-center -outline-offset-1 focus-visible:rounded-md focus-visible:outline"
              value="player"
            >
              <p className="flex flex-col items-center py-4 text-center">
                <span className="px-2">
                  Для участия в турнире тренер команды должен подать заявку, указав Вас в качестве участника.
                </span>
                <span className="px-2">После подачи заявки Вам придет уведомление о необходимости ее подтвердить.</span>
                <img className="my-2 w-screen md:w-[60vw]" src={FILES_SERVER + "img6.png"} alt={"Изображение"} />
                <span className="px-2">
                  Нажмите на уведомление, на открывшейся странице внизу подтвердите согласие на передачу информации.
                </span>
                <img className="my-2 w-screen md:w-[60vw]" src={FILES_SERVER + "img7.png"} alt={"Изображение"} />
                <span className="px-2">Если все сделано верно, Вы увидете, что заявка подтверждена.</span>
                <img className="my-2 w-screen md:w-[60vw]" src={FILES_SERVER + "img8.png"} alt={"Изображение"} />
              </p>
            </Tabs.Panel>
            <Tabs.Panel
              className="outline-accent-primary relative flex h-fit items-center justify-center -outline-offset-1 focus-visible:rounded-md focus-visible:outline"
              value="trainer"
            >
              <p className="flex flex-col items-center py-4 text-center">
                <span className="px-2">
                  Вам необходимо зарегистрировать свою команду на турнир и добавить в неё участников в форме
                  регистрации.
                </span>
                <span className="px-2">Для этого перейдите на страницу турнира и нажмите "Регистрация на турнир".</span>

                <span className="px-2">vВ открывшейся форме заполните поля, выберите задачи и отправьте форму.</span>
                <img className="mt-2 w-screen md:w-[60vw]" src={FILES_SERVER + "img2.png"} alt={"Изображение"} />
                <img className="mb-2 w-screen md:w-[60vw]" src={FILES_SERVER + "img3.png"} alt={"Изображение"} />
                <span className="px-2">Если все сделано верно, Вы увидете подтверждение, что форма заполнена.</span>
                <img className="my-2 w-screen md:w-[60vw]" src={FILES_SERVER + "img4.png"} alt={"Изображение"} />
              </p>
            </Tabs.Panel>
            <Tabs.Panel
              className="outline-accent-primary relative flex h-32 items-center justify-center -outline-offset-1 focus-visible:rounded-md focus-visible:outline"
              value="organizators"
            >
              <div className="bg-bg-alt mx-30 flex size-full flex-col gap-2 rounded-2xl px-2 sm:px-10">
                <p className="w-full pt-4 text-start">Для участия в организации турнира обратитесь в поддержку:</p>
                <ol>
                  <li>
                    Email: <a href={"mailto:antoon.s.ivanov@gmail.com"}>antoon.s.ivanov@gmail.com</a>
                  </li>
                  <li>
                    Телеграм:{" "}
                    <a className="text-accent-primary" href={"https://t.me/AntonIvanov1111"}>
                      Антон Иванов
                    </a>
                  </li>
                </ol>
              </div>
            </Tabs.Panel>
            <Tabs.Panel
              className="outline-accent-primary relative flex h-32 items-center justify-center -outline-offset-1 focus-visible:rounded-md focus-visible:outline"
              value="jury"
            >
              <ProjectIcon className="size-10 text-gray-300" />
            </Tabs.Panel>
            <Tabs.Panel
              className="outline-accent-primary relative flex h-32 items-center justify-center -outline-offset-1 focus-visible:rounded-md focus-visible:outline"
              value="moderator"
            >
              <PersonIcon className="size-10 text-gray-300" />
            </Tabs.Panel>
          </Tabs.Root>
        </div>
        <Button
          className="border-accent-warning bg-accent-warning-alt text-accent-warning з-2 disabled:text-inactive disabled:border-inactive disabled:bg-inactive/20 rounded-xl border-4 p-2 text-3xl transition-colors duration-300"
          onClick={() => {
            startTransition(() => {
              cookies.remove("mtiyt_auth_token")
              dispatch(setAuth(null))
              router.replace("/")
            })
          }}
          disabled={isPending}
        >
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  )
}

function ProjectIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="40" height="40" viewBox="0 0 30 30" fill="currentcolor" {...props}>
      <path d="M 14.984375 1.9863281 A 1.0001 1.0001 0 0 0 14 3 L 14 4 L 5 4 L 4 4 A 1.0001 1.0001 0 1 0 3.9804688 6 C 3.9348612 9.0608831 3.6893807 11.887023 3.1523438 14.142578 C 2.5565033 16.645108 1.6039585 18.395538 0.4453125 19.167969 A 1.0001 1.0001 0 0 0 1 21 L 4 21 C 4 22.105 4.895 23 6 23 L 11.787109 23 L 10.148438 26.042969 A 1.5 1.5 0 0 0 9 27.5 A 1.5 1.5 0 0 0 10.5 29 A 1.5 1.5 0 0 0 12 27.5 A 1.5 1.5 0 0 0 11.910156 26.992188 L 14.060547 23 L 15.939453 23 L 18.089844 26.992188 A 1.5 1.5 0 0 0 18 27.5 A 1.5 1.5 0 0 0 19.5 29 A 1.5 1.5 0 0 0 21 27.5 A 1.5 1.5 0 0 0 19.851562 26.042969 L 18.212891 23 L 24 23 C 25.105 23 26 22.105 26 21 L 26 6 A 1.0001 1.0001 0 1 0 26 4 L 25 4 L 16 4 L 16 3 A 1.0001 1.0001 0 0 0 14.984375 1.9863281 z M 5.9589844 6 L 14.832031 6 A 1.0001 1.0001 0 0 0 15.158203 6 L 23.958984 6 C 23.912194 9.0500505 23.687726 11.893974 23.152344 14.142578 C 22.583328 16.532444 21.674397 18.178754 20.585938 19 L 3.1523438 19 C 3.9976592 17.786874 4.6791735 16.365049 5.0976562 14.607422 C 5.6877248 12.129135 5.9137751 9.1554725 5.9589844 6 z" />
    </svg>
  )
}

function PersonIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="40" height="40" viewBox="0 0 30 30" fill="currentcolor" {...props}>
      <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M8,22.141 c1.167-3.5,4.667-2.134,5.25-4.03v-1.264c-0.262-0.141-1.013-1.109-1.092-1.865c-0.207-0.018-0.531-0.223-0.627-1.034 c-0.051-0.435,0.153-0.68,0.276-0.757c0,0-0.308-0.702-0.308-1.399C11.5,9.72,12.526,8,15,8c1.336,0,1.75,0.947,1.75,0.947 c1.194,0,1.75,1.309,1.75,2.844c0,0.765-0.308,1.399-0.308,1.399c0.124,0.077,0.328,0.322,0.277,0.757 c-0.096,0.811-0.42,1.016-0.627,1.034c-0.079,0.756-0.829,1.724-1.092,1.865v1.264c0.583,1.897,4.083,0.531,5.25,4.031 c0,0-2.618,2.859-7,2.859C10.593,25,8,22.141,8,22.141z" />
    </svg>
  )
}
