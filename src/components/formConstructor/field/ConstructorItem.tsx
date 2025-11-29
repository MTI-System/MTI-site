"use client"
import { useSortable } from "@dnd-kit/react/sortable"
import { useEffect, useRef, useState } from "react"
import { PiDotsNineBold } from "react-icons/pi"
import FieldTypes from "@/components/formConstructor/FieldTypes"
import {
  availableFields,
  Field,
  FieldProperties,
  useConstructorRoot,
} from "@/components/formConstructor/root/RootContext"
import TextFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/TextFieldConstructor"
import NumberFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/NumberFieldConstructor"
import DropdownFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/DropdownFieldConstructor"
import { debounce } from "next/dist/server/utils"
import { CiSettings } from "react-icons/ci"
import FileFieldFormConstructor from "@/components/formConstructor/fieldTypesConstructors/FileFieldFormConstructor"
import PlayerFieldConstructor from "../fieldTypesConstructors/PlayerFieldConstructor"
import DateFieldConstructor from "../fieldTypesConstructors/DatepickerFormConstructor"
import CoachFieldConstructor from "../fieldTypesConstructors/CoachFormConstructor"

export function ConstructorItem({ id, index, field }: { index: number; id: number; field: Field }) {
  const handleRef = useRef<HTMLInputElement | null>(null)
  const { ref } = useSortable({
    id: id,
    index: index,
    handle: handleRef,
  })
  const { setFieldType, changeName } = useConstructorRoot()

  const debouncedUpdateName = debounce((name: string, id: number) => {
    console.log("sendUpdate")
    changeName(name, id)
  }, 500)

  return (
    <>
      <li>
        <div
          ref={ref}
          className="bg-bg-main-accent border-border text-text-main my-2 flex w-full items-center justify-between rounded-xl border px-2 py-2 text-[16px]"
        >
          <div>
            <div className="flex gap-2">
              <input
                className="border-border rounded-xl border ps-2"
                placeholder="Имя"
                defaultValue={field.fieldName}
                onInput={(e) => {
                  debouncedUpdateName(e.currentTarget.value, id)
                }}
              />
              {/*<h3>{field.fieldName}</h3>*/}
              <FieldTypes setFieldType={(value: availableFields) => setFieldType(value, id)} defaultValue={field.properties.fieldType}/>
            </div>
            {/*<p className="text-[22px] font-bold text-text-alt">{field.properties.fieldType}</p>*/}
            <div className="mt-2 flex items-center gap-2">
              <CiSettings />
              <h3 className="font-medium">Параметры поля:</h3>
            </div>
            <div className="ps-5">
              {field.properties.fieldType === "text" ? (
                <TextFieldConstructor id={id} />
              ) : field.properties.fieldType === "number" ? (
                <NumberFieldConstructor id={id} />
              ) : field.properties.fieldType === "dropdown" ? (
                <DropdownFieldConstructor id={id} />
              ) : field.properties.fieldType === "date" ? (
                <DateFieldConstructor id={id}></DateFieldConstructor>
              ) : field.properties.fieldType === "file" ? (
                <FileFieldFormConstructor id={id} />
              ) : field.properties.fieldType === "geolocation" ? (
                <p className="text-text-alt text-[22px] font-bold">Геолокация</p>
              ) : field.properties.fieldType === "player" ? (
                <PlayerFieldConstructor id={id}/>
              ): field.properties.fieldType === "coach" ? (
                <CoachFieldConstructor id={id}/>
              ): (
                <p className="text-text-alt text-[22px] font-bold">Неизвестный тип поля</p>
              )
              } 
              
            </div>
          </div>
          <div ref={handleRef} className="size-10 cursor-grab">
            <PiDotsNineBold size="100%" />
          </div>
        </div>
      </li>
      
    </>
  )
}
