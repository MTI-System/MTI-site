import {DropdownOption, FieldProperties, useConstructorRoot} from "@/components/formConstructor/root/RootContext";
import {debounce} from "next/dist/server/utils";
import {useEffect, useState} from "react";

export default function DropdownFieldConstructor({id}: { id: number }) {
  const {setProperties, getFieldById} = useConstructorRoot()

  const currentProperties = getFieldById(id)?.properties
  const debouncedUpdateProperties = debounce((
    newProperties: FieldProperties, id: number
  ) => {
    console.log("sendUpdate", newProperties)
    setProperties(newProperties, id)
  }, 500)

  const [options, setOptions] = useState<DropdownOption[]>([])

  useEffect(() => {
    debouncedUpdateProperties({fieldType: "dropdown", options: [...options]}, id)
  }, [options])

  return (
    <>
      {options.map((val, idx) =>
      <div key={val.value + `_${idx}`} className="flex justify-between mt-1">
        <label className="text-[0.9rem]" id={"placeholderInput"}>Название поля</label>
        <input type={"text"} defaultValue={val.label} onInput={ (e)=>{
          const newOptions = [...options]
          newOptions[idx].label = e.currentTarget.value
          setOptions(newOptions)
        }
          } className="border border-border rounded-lg ps-2" placeholder={"Введите название"} id={"placeholderInput"}/>
      </div>)
      }
      {/* TODO: Use appendable info container here instead of self written logic*/}
      <button onClick={
        ()=>{
          setOptions(prev=>[...prev, {label: "Новый вариант", value: (prev[prev.length - 1]?.value??"option" )+ "1"}])
        }
      }>Добавить поле</button>

</>
)
}