import {ReactNode} from "react";
import { useCardsRoot } from "./RootContext";

export function FormTrigger(
  {children, onConfirm, className}: {children: ReactNode, onConfirm: (e: FormData) => void, className?: string}
){
  const {getFormData} = useCardsRoot()
  return (
    <>
      <form className={className ?? ""} action={()=>{
        onConfirm(getFormData())
      }}>
        {children}
      </form>
    </>
  )
}