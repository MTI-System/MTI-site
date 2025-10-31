"use client";
import { useCardsRoot} from "../root/RootContext"

export function EditableFormsItems({children}: {children: React.ReactNode}) {
  const { isEdit } = useCardsRoot()
  if (!isEdit) return null;
  return (

    <>
      {children}
    </>
  )
}
