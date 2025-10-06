"use client"
import {ReactNode, useRef} from "react"
import makeTournamentPageStore, {TournamentPageStore} from "@/redux_stores/TournamentPage/TournamentPageReduxStore";
import {TournamentPageStoreProvider} from "@/components/Redux/TournamentPageStoreContext";
import {TournamentCardInterface} from "@/types/TournamentsAPI";


export default function TournamentPageStoreProviderWrapper({ children, tournament }: { children: React.ReactNode, tournament: TournamentCardInterface }) {
    const storeRef = useRef<TournamentPageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeTournamentPageStore(tournament);
    }
    return <TournamentPageStoreProvider store={storeRef.current}>{children}</TournamentPageStoreProvider>;
}