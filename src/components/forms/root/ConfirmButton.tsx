"use client"
import { useCardsRoot } from "./RootContext";
import {ReactNode, useRef} from "react";


export function ConfirmButton(
  {
    onClick,
    className = '',
    children
  }: {
    onClick?: () => void;
    className?: string;
    children: ReactNode
  }
) {
  const { items } = useCardsRoot()
  const submitRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={submitRef} type="submit" className={"absolute size-0"}/>
      <button type="button" className={className} onClick={
        ()=>{
          let isOk = true;
          items?.forEach(func => {
            isOk = func.func().isSuccess && isOk
          });
          console.log(isOk)
          if (isOk) {
            onClick?.();
            if(!submitRef.current){
              return;
            }
            submitRef.current.click();
          }
        }}>
        {children}
      </button>
    </>

  );
}