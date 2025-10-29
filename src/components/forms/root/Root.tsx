"use client"
import { CardsRootContext } from "./RootContext";

export function CardRoot(
  {
    children,
    isEdit,
    isExpanded
  }: {
    children: React.ReactNode;
    isEdit: boolean;
    isExpanded: boolean;
  }
){
    return (
        <>
          <CardsRootContext value={{
            isEdit,
            isExpanded
          }}>
            {children}
          </CardsRootContext>
        </>
    )
}