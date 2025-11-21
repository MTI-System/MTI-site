"use client"
import {Forms} from "@/components/forms"
import DatePicker from "@/components/pickers/DatePicker";
import {ConstructorLayout} from "@/components/formConstructor/ConstructorLayout";
import {Constructor} from "@/components/formConstructor";
import { DayPicker } from "react-day-picker";
import { Suspense } from "react";

export default function SecondTmp() {

  return (
    <>
      <div className="relative size-fit">
        <DayPicker/>
      </div>

      <Constructor.Root>
        <Constructor.Layout/>
      </Constructor.Root>
    </>
  )
}
