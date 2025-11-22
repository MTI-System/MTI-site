import {
  FieldProperties,
  NumberInputProperties,
  useConstructorRoot,
} from "@/components/formConstructor/root/RootContext"
import { debounce } from "next/dist/server/utils"
import { type } from "node:os"

export default function NumberFieldConstructor({ id }: { id: number }) {
  const { setProperties, getFieldById } = useConstructorRoot()
  const currentProperties = getFieldById(id)?.properties
  // if (!(currentProperties && "minValue" in currentProperties && "maxValue" in currentProperties)) {
  //   return <p>error {currentProperties}</p>
  // }
  const debouncedUpdateProperties = debounce((newProperties: FieldProperties, id: number) => {
    console.log("sendUpdate", newProperties)
    setProperties(newProperties, id)
  }, 500)
  return (
    <>
      <div className="mt-1 flex justify-between">
        <label className="text-[0.9rem]" id={"placeholderInput"}>
          Минимальное числовое значение
        </label>
        <input
          type={"number"}
          onInput={(e) => {
            debouncedUpdateProperties(
              {
                fieldType: "number",
                minValue: Number(e.currentTarget.value),
                maxValue: currentProperties && "maxValue" in currentProperties ? currentProperties.maxValue : undefined,
              },
              id,
            )
          }}
          className="border-border rounded-lg border ps-2"
          placeholder={"Подсказка"}
          id={"placeholderInput"}
        />
      </div>
      <div className="mt-1 flex justify-between gap-2">
        <label className="text-[0.9rem]" id={"placeholderInput"}>
          Максимальное числовое значение
        </label>
        <input
          type={"number"}
          onInput={(e) => {
            debouncedUpdateProperties(
              {
                fieldType: "number",
                maxValue: Number(e.currentTarget.value),
                minValue: currentProperties && "minValue" in currentProperties ? currentProperties.minValue : undefined,
              },
              id,
            )
          }}
          className="border-border rounded-lg border ps-2"
          placeholder={"Подсказка"}
          id={"placeholderInput"}
        />
      </div>
    </>
  )
}
