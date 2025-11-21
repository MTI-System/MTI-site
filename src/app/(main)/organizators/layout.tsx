import {ReactNode} from "react";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";

export default async function OrgLayout(
    {children}: {children: ReactNode}
){
    return (
        <>
            <TournamentsProviderWrapper>
                {children}
            </TournamentsProviderWrapper>
        </>
    )
}