"use client"
import { CardsRootProvider } from "./RootContext";

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
          <CardsRootProvider isEdit={isEdit} isExpanded={isExpanded}>
            {children}
          </CardsRootProvider>
        </>
    )
}