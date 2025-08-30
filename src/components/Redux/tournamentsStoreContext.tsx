import React from "react";
import {
  Provider as ReduxProvider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
} from "react-redux";
import {
  RootTournamentsState,
  TournamentsDispatch,
  TournamentsStore
} from "@/redux_stores/Tournaments/tournamentsReduxStore";

export const TournamentsContext = React.createContext(null as any);

// Хуки, привязанные к локальному контексту
const _useTournamentsDispatch = createDispatchHook(TournamentsContext);
const _useTournamentsSelector = createSelectorHook(TournamentsContext);
const _useTournamentsStore = createStoreHook(TournamentsContext);

// c типами (react-redux v9 имеет .withTypes)
export const useTournamentsDispatch = _useTournamentsDispatch.withTypes<TournamentsDispatch>();
export const useTournamentsSelector = _useTournamentsSelector.withTypes<RootTournamentsState>();
export const useTournamentsStore = _useTournamentsStore.withTypes<TournamentsStore>();

// Провайдер локального стора
export function TournamentsStoreProvider({ store, children }: { store: TournamentsStore; children: React.ReactNode }) {
  return (
    <ReduxProvider context={TournamentsContext} store={store}>
      {children}
    </ReduxProvider>
  );
}