import { NotificationInterface } from "@/types/NotificationsApi"

export default function NotificationItem({ notification }: { notification: NotificationInterface }) {
  return (
    <div className="relative">
      <div className="border-border text-text-main rounded-2xl border p-2">
        <h3 className="font-bold">{notification.title}</h3>
        <p>{notification.content}</p>
      </div>
      {!notification.is_read && (
        <div className="absolute top-0 right-0 size-3 rounded-full border-6 border-yellow-300" />
      )}
    </div>
  )
}
