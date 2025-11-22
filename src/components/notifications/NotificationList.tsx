"use client"

import { useState } from "react"
import Loading from "@/app/loading"
import NotificationItem from "@/components/notifications/NotificationItem"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useGetAllNotificationsQuery } from "@/api/notifications/clientApiInterface"

export default function NotificationList() {
  const [isExpanded, setExpanded] = useState(false)
  const userId = useAppSelector((state) => state.auth.authInfo?.user_id)
  const { data, isLoading, isError, isFetching } = useGetAllNotificationsQuery({
    userId: userId ?? 0,
    param: isExpanded ? "all" : "new",
  })

  if (!userId)
    return (
      <div className="text-text-main w-2xs px-2 py-5 text-center font-medium">
        <p>Войдите в аккаунт или зарегестрируйтесь, чтобы получать уведомления</p>
      </div>
    )

  return (
    <>
      <div>
        <div
          className="mt-2 h-[20rem] w-[20rem] overflow-y-auto"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {isFetching && <Loading />}
          {isError && <span>Ошибка!!</span>}
          {!isFetching && !isError && (
            <div className="flex flex-col gap-2">
              {data?.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>

        <button
          className="bg-accent-primary/20 text-accent-primary border-accent-primary hover:bg-accent-primary/50 mt-2 rounded-2xl border p-2 transition-colors"
          onClick={() => setExpanded(!isExpanded)}
        >
          {isExpanded ? "Показать новые" : "Показать все"}
        </button>
      </div>
    </>
  )
}
