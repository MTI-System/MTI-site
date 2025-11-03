import {ReactNode} from "react";

export function FormTrigger(
  {children, onConfirm, className}: {children: ReactNode, onConfirm: (e: FormData) => void, className?: string}
){
  return (
    <>
      <form className={className ?? ""} action={onConfirm}>
        {children}
      </form>
    </>
  )
}