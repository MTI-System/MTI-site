"use client"
import style from "@/styles/routes/(main)/profile/profilePage.module.css"
import {User} from "@/types/authApi"
import {Right} from "@/types/authApi"
import {useRouter} from "next/navigation"
import cookies from "js-cookie"
import {useAppDispatch} from "@/redux_stores/Global/tournamentTypeRedixStore"
import {setAuth} from "@/redux_stores/Global/AuthSlice"
import {Button, HoldButton} from "@/components/ui/Buttons"
import React, {startTransition, useTransition} from "react"
import {Accordion, Tabs} from "@base-ui-components/react"
import {FILES_SERVER} from "@/constants/APIEndpoints"
import {useGetUserByAuthIdQuery, useGetUserByIdQuery} from "@/api/users/clientApiInterface";
import Instructions from "@/components/profile/Instructions";
import UserInformation from "@/components/profile/UserInformation";
import Loading from "@/app/loading";

export default function ProfileMainPage({profileData}: { profileData: User }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const {data: user, isLoading, refetch} = useGetUserByAuthIdQuery(
    {id: profileData.user_id}
  );
  return (
    <>
      { !isLoading ? (<div className={"text-text-main flex w-full justify-center py-2"}>
        <div className={"bg-bg-alt flex w-full flex-col items-center justify-center rounded-2xl py-5"}>
          <h1 className={"text-center text-3xl font-bold"}>Добро
            пожаловать, {user?.firstName} {user?.secondName} {user?.thirdName} !</h1>
          {/*<Instructions/>*/}
          <Accordion.Root
            className="flex w-full py-10 max-w-[calc(100vw-8rem)] flex-col justify-center text-text-main rounded-xl overflow-hidden">
            <Accordion.Item className="">
              <Accordion.Header>
                <Accordion.Trigger
                  className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-main py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                  Мой профиль
                  <PlusIcon
                    className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45"/>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                <div className="p-3">
                  {user && <UserInformation isEditing={false} user={user} refetch={refetch}/>}
                </div>
                <div className="p-3">
                  {!user && <p>Ошибка загрузки информации о пользователе</p>}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item className="">
              <Accordion.Header>
                <Accordion.Trigger
                  className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-main py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                  Как пользоваться платформой?
                  <PlusIcon
                    className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45"/>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                <div className="p-3">
                  <Instructions/>
                </div>
              </Accordion.Panel>
            </Accordion.Item>

          </Accordion.Root>
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
      </div>) : <Loading/>
      }
    </>


)
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z"/>
    </svg>
  );
}
