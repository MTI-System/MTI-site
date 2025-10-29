"use client";
import { useCardsRoot } from "../root/RootContext"

export function EditableCardItems({children}: {children: React.ReactNode}) {
  const { isEdit } = useCardsRoot()
  if (!isEdit) return null;
  return (

    <>
      {children}
    </>
  )
}
