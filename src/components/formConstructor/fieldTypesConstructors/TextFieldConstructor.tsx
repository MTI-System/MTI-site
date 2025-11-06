import {FieldProperties, useConstructorRoot} from "@/components/formConstructor/root/RootContext";
import {debounce} from "next/dist/server/utils";
import {Field} from "@base-ui-components/react/field";

export default function TextFieldConstructor({id}: {id: number}) {
  const {setProperties} = useConstructorRoot()

  const debouncedUpdateProperties = debounce((
    newProperties: FieldProperties, id: number
  )=>{
    console.log("sendUpdate")
    setProperties(newProperties, id)
  }, 500)
  return (
    <>
      <div className="flex flex-col">
        <label className="text-[0.9rem]" id={"placeholderInput"}>Введите текст подсказки</label>
        <input  onInput={(e)=>{
          debouncedUpdateProperties({fieldType: "text", placeholder: e.currentTarget.value}, id)
        }} className="border border-border rounded-lg ps-2" placeholder={"Подсказка"} id={"placeholderInput"}/>
      </div>

    </>
  )
}