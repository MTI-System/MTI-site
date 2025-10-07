"use client"

import {useState} from "react";
import {useGetAllNotificationsQuery} from "@/api/notificationsApiRTK";
import Loading from "@/app/loading";
import NotificationItem from "@/components/notifications/NotificationItem";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";


export default function NotificationList() {
    const [isExpanded, setExpanded] = useState(false);
    const userId = useAppSelector(state => state.auth.authInfo?.user_id);
    const { data, isLoading, isError } = useGetAllNotificationsQuery(
        { userId:  userId??0, param: isExpanded ? "all" : "new" },
    );
    return (
        <>
            <div>
                <div className="w-[20rem] h-[20rem] mt-2 overflow-y-auto" style={{
                    scrollbarWidth: "none",
                }}>
                    {isLoading && <Loading />}
                    {isError && <span>Ошибка!!</span>}
                    {(!isLoading && !isError) && (
                        <div className="flex flex-col gap-2">
                            {data?.map((notification) => (
                                <NotificationItem key={notification.id} notification={notification} />
                            ))}
                        </div>
                    )}
                </div>

                <button className="mt-2 bg-accent-primary/20 text-accent-primary p-2 rounded-2xl border border-accent-primary hover:bg-accent-primary/50 transition-colors" onClick={()=>setExpanded(!isExpanded)}>{isExpanded ? "Показать новые" : "Показать все"}</button>


            </div>
        </>
    )
}