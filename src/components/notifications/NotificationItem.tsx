import {NotificationInterface} from "@/types/NotificationsApi";

export default function NotificationItem(
    {notification}: {notification: NotificationInterface}
){
    return (
        <div className="relative">
            <div className="border border-border p-2 rounded-2xl text-text-main">
                <h3 className="font-bold">{notification.title}</h3>
                <p>{notification.content}</p>
            </div>
            {!notification.is_read && <div className="absolute rounded-full border-6 border-yellow-300 size-3 right-0 top-0"/>}
        </div>
    )
}