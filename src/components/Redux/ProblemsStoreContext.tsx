import React from "react"
import { Provider as ReduxProvider, createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import {
  RootTournamentsState,
  TournamentsDispatch,
  TournamentsStore,
} from "@/redux_stores/Tournaments/tournamentsReduxStore"
import { ProblemsDispatch, ProblemsStore, RootProblemsState } from "@/redux_stores/Problems/ProblemsReduxStore"

export const ProblemsContext = React.createContext(null as any)

// Хуки, привязанные к локальному контексту
const _useProblemsDispatch = createDispatchHook(ProblemsContext)
const _useProblemsSelector = createSelectorHook(ProblemsContext)
const _useProblemsStore = createStoreHook(ProblemsContext)

// c типами (react-redux v9 имеет .withTypes)
export const useProblemsDispatch = _useProblemsDispatch.withTypes<ProblemsDispatch>()
export const useProblemsSelector = _useProblemsSelector.withTypes<RootProblemsState>()
export const useProblemsStore = _useProblemsStore.withTypes<ProblemsStore>()

// Провайдер локального стора
export function ProblemsStoreProvider({ store, children }: { store: ProblemsStore; children: React.ReactNode }) {
  return (
    <ReduxProvider context={ProblemsContext} store={store}>
      {children}
    </ReduxProvider>
  )
}
