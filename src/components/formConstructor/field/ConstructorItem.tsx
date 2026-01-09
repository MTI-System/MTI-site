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
import CoachFieldConstructor from "../fieldTypesConstructors/CoachFormConstructor"
import DateFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/DatePickerFormConstructor"
import { Checkbox } from "@base-ui-components/react"
import { MdDelete, MdDeleteOutline } from "react-icons/md"

export function ConstructorItem({ id, index, field }: { index: number; id: number; field: Field }) {
  const handleRef = useRef<HTMLInputElement | null>(null)
  const { ref } = useSortable({
    id: id,
    index: index,
    handle: handleRef,
  })
  const { setFieldType, changeName, setOptional, removeField } = useConstructorRoot()

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

              <FieldTypes
                setFieldType={(value: availableFields) => setFieldType(value, id)}
                defaultValue={field.properties.fieldType}
              />
              <label className="flex items-center gap-2 text-base text-gray-900">
                <Checkbox.Root
                  onCheckedChange={(checked) => {
                    setOptional(!checked, id)
                  }}
                  checked={!(field.optional ?? false)}
                  className="flex size-5 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
                >
                  <Checkbox.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
                    <CheckIcon className="size-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                Обязательное поле
              </label>
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
                <PlayerFieldConstructor id={id} />
              ) : field.properties.fieldType === "coach" ? (
                <CoachFieldConstructor id={id} />
              ) : (
                <p className="text-text-alt text-[22px] font-bold">Неизвестный тип поля</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div
              className="size-10 cursor-pointer p-1 text-red-500"
              onClick={() => {
                removeField(id)
              }}
            >
              <MdDeleteOutline size="100%" />
            </div>
            <div ref={handleRef} className="size-10 cursor-grab">
              <PiDotsNineBold size="100%" />
            </div>
          </div>
        </div>
      </li>
    </>
  )
}
function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}
