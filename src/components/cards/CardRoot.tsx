import { TournamentCardCallback } from "@/app/(main)/organizators/create/page";
import { ReactNode } from "react"
import CardContent from "./CardContent";
import Link from "next/link";

export type AvailableRoutings = "tournaments" | "users"

type anyKey = { [key: string]: any }
export interface ExtendedCardInterface extends anyKey, CardInterface {

}

export default function CardRoot<T>(
    {   
        card,
        isExtended = false,
        onUpdateCreate = null,
        errors = [],
        children,
        isAdmin = false,
        isCreate,
        mainPath, // Путь до корня роутинга того, для чего нужнв карточкка (tournaments, users ..)
    }: {
        children: ReactNode,
        isCreate: boolean
        onUpdateCreate?: T | null
        errors?: { key: string; message: string }[]
        isAdmin?: boolean,
        isExtended: boolean,
        card: ExtendedCardInterface
        mainPath: AvailableRoutings
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
                    mainPath={mainPath}
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
            isAdmin={isAdmin}
            mainPath={mainPath}
            >
                {children}
            </CardContent>
        )}
            
        </>
    )
}