import React from "react"
import { Provider as ReduxProvider, createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import {
  RootTournamentPageState,
  TournamentPageDispatch,
  TournamentPageStore,
} from "@/redux_stores/TournamentPage/TournamentPageReduxStore"

export const TournamentsContext = React.createContext(null as any)

// Хуки, привязанные к локальному контексту
const _useTournamentPageDispatch = createDispatchHook(TournamentsContext)
const _useTournamentPageSelector = createSelectorHook(TournamentsContext)
const _useTournamentPageStore = createStoreHook(TournamentsContext)

// c типами (react-redux v9 имеет .withTypes)
export const useTournamentPageDispatch = _useTournamentPageDispatch.withTypes<TournamentPageDispatch>()
export const useTournamentPageSelector = _useTournamentPageSelector.withTypes<RootTournamentPageState>()
export const useTournamentPageStore = _useTournamentPageStore.withTypes<TournamentPageStore>()

// Провайдер локального стора
export function TournamentPageStoreProvider({
  store,
  children,
}: {
  store: TournamentPageStore
  children: React.ReactNode
}) {
  return (
    <ReduxProvider context={TournamentsContext} store={store}>
      {children}
    </ReduxProvider>
  )
}
