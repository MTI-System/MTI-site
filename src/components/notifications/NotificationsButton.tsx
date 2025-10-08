import { Popover } from "@base-ui-components/react";
import { FaBell } from "react-icons/fa";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationsProviderWrapper from "@/api/notifications/ClientWrapper";

export default function NotificationsButton(){

    return (
        <Popover.Root>
            <Popover.Trigger className="aspect-square h-16 rounded-full border-2">
                <FaBell className="size-full p-3" style={{ width: "100%", height: "100%" }}/>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner className="relative z-2 " sideOffset={8} align={"end"}>
                    <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                        <Popover.Title className="font-medium text-text-main text-xl">Ваши уведомления</Popover.Title>
                        <NotificationsProviderWrapper>
                            <NotificationList/>
                        </NotificationsProviderWrapper>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>


    )
}