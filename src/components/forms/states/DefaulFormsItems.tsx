"use client"
import { useCardsRoot } from "../root/RootContext";

export function DefaultCardItems({children}: {children: React.ReactNode}) {
  const { isEdit } = useCardsRoot()
  if (isEdit) return null;
  return (
    <>
      {children}
    </>
  )
}
