"use client"

import React, {ReactNode} from "react";
import {Provider} from "react-redux";
import makeNotificationsStore from "@/api/stores/notificationsStore";
import {NotificationsApiContext} from "@/api/notificationsApiRTK";


export default function NotificationsProviderWrapper({children}: {children: ReactNode}) {
    const notificationsApiStore = makeNotificationsStore();
    return (
        <>
            <Provider store={notificationsApiStore} context={NotificationsApiContext}>
                {children}
            </Provider>
        </>
    )
}