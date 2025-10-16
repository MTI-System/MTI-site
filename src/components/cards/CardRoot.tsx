import { TournamentCardCallback } from "@/app/(main)/organizators/create/page";
import { ReactNode } from "react"
import CardContent from "./CardContent";
import Link from "next/link";

export default function CardRoot<T>(
    {   
        card,
        isExtended = false,
        onUpdateCreate = null,
        errors = [],
        children,
        isAdmin = false,
        isCreate
    }: {
        children: ReactNode,
        isCreate: boolean
        onUpdateCreate?: T | null
        errors?: { key: string; message: string }[]
        isAdmin?: boolean,
        isExtended: boolean,
        card: CardInterface
    }
){
    return (
        <>
        {!isExtended ? (
            // <Link href={`/tournaments/${tournamentCard?.id ?? 0}/${isCreate ? "info/about" : "info/about"}`}>
            <Link href={`/tournaments/`}>
                <CardContent
                    card={card}
                    isExtended={isExtended}
                    isCreate={isCreate}
                    onUpdateCreate={onUpdateCreate}
                    errors={errors}
                    isAdmin={isAdmin}
                >
                    {children}
                </CardContent>
            </Link>
        ) : (
            <CardContent
            card={card}
            isExtended={isExtended}
            isCreate={isCreate}
            onUpdateCreate={onUpdateCreate}
            errors={errors}
            isAdmin={isAdmin}>
                {children}
            </CardContent>
        )}
            
        </>
    )
}