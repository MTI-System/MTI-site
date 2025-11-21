"use client"

import {useState} from "react";
import Loading from "@/app/loading";
import NotificationItem from "@/components/notifications/NotificationItem";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {useGetAllNotificationsQuery} from "@/api/notifications/clientApiInterface";


export default function NotificationList() {
    const [isExpanded, setExpanded] = useState(false);
    const userId = useAppSelector(state => state.auth.authInfo?.user_id);
    const { data, isLoading, isError, isFetching } = useGetAllNotificationsQuery(
        { userId:  userId??0, param: isExpanded ? "all" : "new" },
        
    );

    if (!userId) return <div className="text-text-main text-center font-medium py-5 px-2 w-2xs"><p>Войдите в аккаунт или зарегестрируйтесь, чтобы получать уведомления</p></div>

    return (
        <>
            <div>
                <div className="w-[20rem] h-[20rem] mt-2 overflow-y-auto" style={{
                    scrollbarWidth: "none",
                }}>
                    {isFetching && <Loading />}
                    {isError && <span>Ошибка!!</span>}
                    {(!isFetching && !isError) && (
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