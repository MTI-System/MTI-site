import { FieldProperties, useConstructorRoot, TextInputProperties } from "@/components/formConstructor/root/RootContext"
import { debounce } from "next/dist/server/utils"

export default function TextFieldConstructor({ id }: { id: number }) {
  const { setProperties, getFieldById } = useConstructorRoot()
  const field = getFieldById(id)

  const debouncedUpdateProperties = debounce((newProperties: FieldProperties, id: number) => {
    console.log("sendUpdate")
    setProperties(newProperties, id)
  }, 500)
  return (
    <>
      <div className="flex flex-col">
        <label className="text-[0.9rem]" id={"placeholderInput"}>
          Введите текст подсказки
        </label>
        <input
          onInput={(e) => {
            debouncedUpdateProperties({ fieldType: "text", placeholder: e.currentTarget.value }, id)
          }}
          className="border-border rounded-lg border ps-2"
          placeholder={"Подсказка"}
          id={"placeholderInput"}
          //@ts-ignore
          defaultValue={field?.properties.placeholder}
        />
      </div>
    </>
  )
}
