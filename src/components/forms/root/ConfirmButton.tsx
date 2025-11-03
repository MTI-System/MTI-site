"use client"
import { useCardsRoot } from "./RootContext";
import {useRef} from "react";


export function ConfirmButton(
  {
    onClick,
    className = ''
  }: {
    onClick: () => void;
    className?: string;
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
            onClick();
            if(!submitRef.current){
              return;
            }
            submitRef.current.click();
          }
        }}>
        Confirm
      </button>
    </>

  );
}