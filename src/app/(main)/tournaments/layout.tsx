"use client"
import { ReactNode } from "react";

import { DayPicker } from "react-day-picker";


export default function l(
  {children}: {children: ReactNode}
){
  return <>
     <DayPicker/>
    {children}




  </>
}
