import {ReactNode} from "react";

export function FormTrigger(
  {children, onConfirm}: {children: ReactNode, onConfirm: (e: FormData) => void}
){
  return (
    <>
      <form action={onConfirm}>
        {children}
      </form>
    </>
  )
}