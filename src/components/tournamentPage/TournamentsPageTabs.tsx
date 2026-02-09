"use client"
import { useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import React from "react"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { NavigationMenu } from "@base-ui-components/react"
import Link from "next/link"
import { TournamentCardInterface } from "@/types/TournamentsAPI"
import { MdLock } from "react-icons/md"
import { useIsFormFilledQuery } from "@/api/registration/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import twclsx from "@/utils/twClassMerge"

interface LinkInterface {
  href: string
  title: string
  description?: string
  isLocked: boolean
}

export default function TournamentsPageTabs({
  tournamentCard,
  isAdmin,
}: {
  tournamentCard: TournamentCardInterface
  isAdmin: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isModerate = searchParams.get("isModerate") ?? false
  const user = useAppSelector((state) => state.auth.authInfo)

  const infoLinks: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/info/about`,
      title: "О турнире",
      description: "Информация о турнирe от организатора",
      isLocked: false,
    },
    {
      href: `/tournaments/${tournamentCard.id}/info/teams`,
      title: "Команды",
      description: "Все зарегистрированные команды",
      isLocked:
        tournamentCard.badge.badge_flag !== "PROCESSING" &&
        tournamentCard.badge.badge_flag !== "REGISTRATION_CLOSED" &&
        tournamentCard.badge.badge_flag !== "ENDED",
    },
    {
      href: `/tournaments/${tournamentCard.id}/info/problems`,
      title: "Задачи",
      description: "Задачи, которые играются на турнире",
      isLocked: false,
    },
  ]

  const resultsLinks: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/results/team`,
      title: "Командный зачет",
      isLocked:
        tournamentCard.badge.badge_flag === "FUTURED" ||
        tournamentCard.badge.badge_flag === "REGISTRATION" ||
        tournamentCard.badge.badge_flag === "REGISTRATION_CLOSED",
    },
    {
      href: `/tournaments/${tournamentCard.id}/results/personal`,
      title: "Личный зачет",
      isLocked:
        tournamentCard.badge.badge_flag === "FUTURED" ||
        tournamentCard.badge.badge_flag === "REGISTRATION" ||
        tournamentCard.badge.badge_flag === "REGISTRATION_CLOSED",
    },
    {
      href: `/tournaments/${tournamentCard.id}/results/teamlogs`,
      title: "Путевые листы",
      isLocked: tournamentCard.badge.badge_flag === "FUTURED" || tournamentCard.badge.badge_flag === "REGISTRATION",
    },
  ]

  const fightsLinksPrev: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/fights`,
      title: `Расписание`,
      isLocked:
        tournamentCard.badge.badge_flag === "FUTURED" ||
        tournamentCard.badge.badge_flag === "REGISTRATION" ||
        tournamentCard.badge.badge_flag === "REGISTRATION_CLOSED",
    },
    ...tournamentCard.fight_containers_cards.map((container) => ({
      href: `/tournaments/${tournamentCard.id}/fights/${container.id}`,
      title: container.title,
      isLocked:
        tournamentCard.badge.badge_flag === "FUTURED" ||
        tournamentCard.badge.badge_flag === "REGISTRATION" ||
        tournamentCard.badge.badge_flag === "REGISTRATION_CLOSED",
    })),
  ]

  const finalIndex = fightsLinksPrev.findIndex((link) => link.title == "Финал")
  const fightsLinks: LinkInterface[] =
    finalIndex >= 0
      ? [...fightsLinksPrev.filter((link) => link !== fightsLinksPrev[finalIndex]), fightsLinksPrev[finalIndex]]
      : fightsLinksPrev.filter((link) => link !== fightsLinksPrev[finalIndex])

  if (tournamentCard.id === 10)
    fightsLinks.push({
      href: `/tournaments/${tournamentCard.id}/fights/selectedtasks/`,
      title: `Задачи на 4-й бой`,
      isLocked: false,
    })

  const statsLinks: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/stats/problems`,
      title: "Задачи",
      description: "Статистика по каждой задаче",
      isLocked: true,
    },
    {
      href: `/tournaments/${tournamentCard.id}/stats/fights`,
      title: "Бои",
      description: "Статистика по боям",
      isLocked: true,
    },
    {
      href: `/tournaments/${tournamentCard.id}/stats/persons`,
      title: "Участники",
      description: "Статистика по участникам",
      isLocked: true,
    },
  ]

  const applicationsLinks: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/applications/list`,
      title: "Заявки",
      description: "Заявки, отправленные участниками",
      isLocked: false,
    },
    {
      href: `/tournaments/${tournamentCard.id}/applications/construction`,
      title: "Конструктор",
      description: "Конструктор формы заявок",
      isLocked: false,
    },
    {
      href: `/tournaments/${tournamentCard.id}/registration`,
      title: "Заполнить форму",
      description: "Если вы руководитель",
      isLocked: tournamentCard.badge.badge_flag !== "REGISTRATION",
    },
  ]

  const staffLinks: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/staff/management`,
      title: "Администраторы",
      description: "Выдачи прав администрации турнира",
      isLocked: true,
    },
    {
      href: `/tournaments/${tournamentCard.id}/staff/jury`,
      title: "Жюри",
      description: "Список жюри",
      isLocked: true,
    },
  ]

  const registrationLinks: LinkInterface[] = [
    {
      href: `/tournaments/${tournamentCard.id}/registration`,
      title: "Заполнить форму",
      description: "Если вы руководитель",
      isLocked: tournamentCard.badge.badge_flag !== "REGISTRATION",
    },
    {
      href: `/tournaments/${tournamentCard.id}/registration?jury=true`,
      title: "Заполнить форму для жюри",
      description: "Если вы хотите судить турнир",
      isLocked: tournamentCard.badge.badge_flag !== "REGISTRATION",
    },
  ]

  return (
    <NavigationMenu.Root className="flex w-full justify-center rounded-lg p-1">
      <NavigationMenu.List className="bg-bg-alt text-text-main relative flex w-full flex-col rounded-2xl md:w-auto md:flex-row">
        <NavigationItem hasDescription={true} items={infoLinks} itemTitle="Информация" />
        {isAdmin && (
          <>
            <NavigationItem hasDescription={true} items={applicationsLinks} itemTitle="Заявки" />
            <NavigationItem hasDescription={true} items={staffLinks} itemTitle="Персонал" />
          </>
        )}
        <NavigationItem hasDescription={false} items={resultsLinks} itemTitle="Результаты" />
        <NavigationItem hasDescription={false} items={fightsLinks} itemTitle="Бои" />
        <NavigationItem hasDescription={true} items={statsLinks} itemTitle="Статистика" />
        {tournamentCard.badge.badge_flag === "REGISTRATION" && !isAdmin && (
          // <NavigationItem hasDescription={true} items={registrationLinks} itemTitle="Регистрация на турнир" className={registrationTriggerClassName}/>
          <NavigationItem
            hasDescription={true}
            items={registrationLinks}
            itemTitle="Регистрация на турнир"
            className="bg-accent-primary text-accent-primary-alt dark:text-text-main hover:bg-accent-primary/80 active:bg-accent-primary/80 data-[popup-open]:bg-accent-primary/80 shadow-accent-primary rounded-xl shadow-[0_0_20px_0_var(--tw-shadow-color)]"
          />

          // <NavigationMenu.Item>
          //   <Link className={registrationTriggerClassName} href={`/tournaments/${tournamentCard.id}/registration`}>
          //     Регистрация на турнир
          //   </Link>
          // </NavigationMenu.Item>
        )}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          sideOffset={10}
          collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
          collisionAvoidance={{ side: "none" }}
          className="box-border h-(--positioner-height) w-(--positioner-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
          style={{
            ["--duration" as string]: "0.35s",
            ["--easing" as string]: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] xs:w-[var(--popup-width)] relative z-10 h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing) data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <NavigationMenu.Arrow className="flex transition-[left] duration-(--duration) ease-(--easing) data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <ArrowSvg />
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}

function ChevronDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  )
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className=""
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className=""
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className=""
      />
    </svg>
  )
}

function NavigationItem({
  hasDescription,
  items,
  itemTitle,
  className,
}: {
  hasDescription: boolean
  items: LinkInterface[]
  itemTitle: string
  className?: string
}) {
  return (
    <>
      <NavigationMenu.Item className="">
        <NavigationMenu.Trigger className={twclsx(triggerClassName, className)}>
          {itemTitle}
          <NavigationMenu.Icon className="transition-transform duration-200 ease-in-out data-popup-open:rotate-180">
            <ChevronDownIcon />
          </NavigationMenu.Icon>
        </NavigationMenu.Trigger>

        <NavigationMenu.Content className={contentClassName}>
          <ul className="flex max-w-[400px] flex-col justify-center">
            {items.map((item) => (
              <li key={item.href} className="hover:bg-hover rounded-sm transition-colors">
                <NavigationMenu.Link
                  closeOnClick
                  render={({ children }) => (
                    <Link href={item.isLocked ? "" : item.href} className={linkCardClassName}>
                      {children}
                    </Link>
                  )}
                >
                  {/* <Link href={item.isLocked ? "" : item.href} className={linkCardClassName}> */}
                  <div className="text-text-main flex items-center gap-2">
                    {item.isLocked && <MdLock />}
                    <div>
                      <h3 className="m-0 mb-1 text-base leading-5 font-medium text-nowrap">{item.title}</h3>
                      {hasDescription && (
                        <p className="text-text-alt m-0 text-sm leading-5 text-nowrap">{item.description}</p>
                      )}
                    </div>
                  </div>
                  {/* </Link> */}
                </NavigationMenu.Link>
              </li>
            ))}
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </>
  )
}

const triggerClassName =
  "transition-colors box-border w-full flex items-center justify-center gap-1.5 h-10 bg-bg-alt " +
  "px-2 xs:px-3.5 m-0 rounded-md font-medium text-text-main " +
  "text-[0.925rem] xs:text-base leading-6 select-none no-underline " +
  "hover:bg-hover active:bg-hover data-[popup-open]:bg-hover " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 focus-visible:relative"

const registrationTriggerClassName =
  "box-border flex items-center justify-center gap-1.5 h-6 ms-5 my-2 me-2 " +
  "px-2 xs:px-3.5 m-0 rounded-md bg-accent-primary text-text-on-accent font-medium " +
  "text-[0.925rem] xs:text-base leading-6 select-none no-underline " +
  "hover:bg-accent-primary/70 hover:shadow-accent-primary/70 shadow-accent-primary shadow-[0_0_0_2px_var(--tw-shadow-color),0_0_30px_0_var(--tw-shadow-color)] data-[popup-open]:bg-hover " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 focus-visible:relative"

// const registrationTriggerClassName =
//   "box-border flex items-center justify-center gap-1.5 h-6 ms-5 my-2 me-2 " +
//   "px-2 xs:px-3.5 m-0 rounded-md font-medium" +
//   "text-[0.925rem] xs:text-base leading-6 select-none no-underline " +
//   "data-[popup-open]:bg-hover" +
//   "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 focus-visible:relative"

const contentClassName =
  "w-full h-full p-2 xs:w-max xs:min-w-[400px] xs:w-max" +
  "transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] " +
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 " +
  "data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] " +
  "data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] " +
  "data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] " +
  "data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]"

const linkCardClassName =
  "block rounded-md p-2 xs:p-3 no-underline text-inherit" +
  "hover:bg-black focus-visible:relative focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:-outline-offset-1 focus-visible:outline-blue-800"
