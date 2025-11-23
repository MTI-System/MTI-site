import AuthProviderWrapper from "@/api/auth/ClientWrapper";
import { ReactNode } from "react";

export default function LogLayout(
    {children}: {children: ReactNode}
){
    return (
        <>
            <AuthProviderWrapper>
                {children}
            </AuthProviderWrapper>
        </>
    )
}