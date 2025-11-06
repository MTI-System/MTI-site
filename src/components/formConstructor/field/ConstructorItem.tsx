import {useSortable} from "@dnd-kit/react/sortable";
import {useEffect, useRef, useState} from "react";
import {PiDotsNineBold} from "react-icons/pi";
import FieldTypes from "@/components/formConstructor/FieldTypes";
import {
  availableFields,
  Field,
  FieldProperties,
  useConstructorRoot
} from "@/components/formConstructor/root/RootContext";
import TextFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/TextFieldConstructor";
import NumberFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/NumberFieldConstructor";
import DropdownFieldConstructor from "@/components/formConstructor/fieldTypesConstructors/DropdownFieldConstructor";
import {debounce} from "next/dist/server/utils";
import {CiSettings} from "react-icons/ci";


export function ConstructorItem({id, index, field}: { index: number, id: number, field: Field}) {
  const handleRef = useRef<HTMLInputElement | null>(null)
  const {ref} = useSortable({
    id: id,
    index: index,
    handle: handleRef,
  })
  const {setFieldType, changeName} = useConstructorRoot()

  const debouncedUpdateName = debounce((
    name: string, id: number
  )=>{
    console.log("sendUpdate")
    changeName(name, id)
  }, 500)



  return (
    <>
      <li>
        <div ref={ref} className="flex justify-between w-full bg-bg-main-accent my-2 border border-border items-center px-2 text-text-main text-[16px] rounded-xl py-2 px-2">
          <div>
            <div className="flex gap-2">
              <input className="border border-border rounded-xl ps-2" placeholder="Имя" defaultValue={field.fieldName} onInput={(e)=>{
                debouncedUpdateName(e.currentTarget.value, id)
              }}/>
              {/*<h3>{field.fieldName}</h3>*/}
              <FieldTypes setFieldType={(value: availableFields)=>setFieldType(value, id)} />
            </div>
            {/*<p className="text-[22px] font-bold text-text-alt">{field.properties.fieldType}</p>*/}
            <div className="flex items-center gap-2 mt-2">
              <CiSettings />
              <h3 className="font-medium">Параметры поля:</h3>
            </div>
            <div className="ps-5">
              {
                field.properties.fieldType === "text" ? <TextFieldConstructor id={id}/> :
                  field.properties.fieldType === "number" ? <NumberFieldConstructor id={id}/> :
                    field.properties.fieldType === "dropdown" ? <DropdownFieldConstructor id={id}/> :
                      <p className="text-[22px] font-bold text-text-alt">Неизвестный тип поля</p>
              }
            </div>

          </div>
          <div ref={handleRef} className="size-10 cursor-grab"><PiDotsNineBold size="100%" /></div>
        </div>

      </li>

    </>
  )
}