import { NotificationInterface } from "@/types/NotificationsApi"
import Link from "next/link";

export default function NotificationItem({ notification, markAsReaded }: { notification: NotificationInterface, markAsReaded: ()=> void }) {
  return (
    <div className="relative">
      {(notification.metadata.type === "personalData" && !notification.is_read) ? (
        <Link href={`/tournaments/${notification.metadata.personalDataTournamentId}/registration/conformation`}>
          <div className="border-border text-text-main rounded-2xl border p-2">
            <h3 className="font-bold">{notification.title}</h3>
            <p>{notification.content}</p>
            <p className="text-blue-600 hover:underline" onClick={(e)=>{
              e.preventDefault()
              markAsReaded()
            }}>Пометить как прочитанное</p>
          </div>

        </Link>

      ) : (
        <div className="border-border text-text-main rounded-2xl border p-2 cursor-not-allowed opacity-60" aria-disabled="true">
          <h3 className="font-bold">{notification.title}</h3>
          <p>{notification.content}</p>
        </div>
      )}

      {!notification.is_read && (
        <div className="absolute top-0 right-0 size-3 rounded-full border-6 border-yellow-300" />
      )}
    </div>
  )
}
