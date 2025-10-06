"use client"
import {ReactNode, useRef} from "react"
import makeTournamentsStore, {TournamentsStore} from "@/redux_stores/Tournaments/tournamentsReduxStore";
import {TournamentsStoreProvider} from "@/components/Redux/tournamentsStoreContext";


export default function TournamentsStoreProviderWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<TournamentsStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeTournamentsStore();
  }
  return <TournamentsStoreProvider store={storeRef.current}>{children}</TournamentsStoreProvider>;
}