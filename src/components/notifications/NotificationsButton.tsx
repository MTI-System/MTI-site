import { Popover } from "@base-ui-components/react"
import { FaBell } from "react-icons/fa"
import NotificationList from "@/components/notifications/NotificationList"
import NotificationsProviderWrapper from "@/api/notifications/ClientWrapper"
import { cookies } from "next/headers"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { makeAuthStoreServer } from "@/api/auth/serverStore"
import { makeNotificationsStoreServer } from "@/api/notifications/serverStore"
import { notificationsApiServer } from "@/api/notifications/serverApiInterface"
import twclsx from "@/utils/twClassMerge"

export default async function NotificationsButton() {
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const authStore = makeAuthStoreServer()
  const authPromise = authStore.dispatch(
    authApiServer.endpoints.fetchPermissions.initiate({
      token: token,
    }),
  )
  const { data, error } = await authPromise

  const notificationStore = makeNotificationsStoreServer()
  let hasNew = false
  if (data) {
    const notificationPromise = notificationStore.dispatch(
      notificationsApiServer.endpoints.getAllNotifications.initiate({
        userId: data?.user_id,
        param: "new",
      }),
    )
    const { data: notificationsData, error: notificationsError } = await notificationPromise
    hasNew = (notificationsData?.length ?? 0) > 0
  }

  return (
    <>
      {!error && (
        <Popover.Root>
          <Popover.Trigger className="aspect-square h-16 cursor-pointer rounded-full border-2">
            <div
              className={twclsx(
                "before:bg-accent-warning before:border-border relative h-full w-full p-3 before:invisible before:absolute before:top-3 before:right-3 before:h-3.5 before:w-3.5 before:rounded-full before:border",
                { "before:visible": hasNew },
              )}
            >
              <FaBell className="size-full h-full w-full" />
            </div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner className="relative z-2" sideOffset={8} align={"end"}>
              <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                <Popover.Title className="text-text-main text-xl font-medium">Ваши уведомления</Popover.Title>
                <NotificationsProviderWrapper>
                  <NotificationList />
                </NotificationsProviderWrapper>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </>
  )
}
