import { FieldProperties, useConstructorRoot } from "@/components/formConstructor/root/RootContext"
import { debounce } from "next/dist/server/utils"

export default function PlayerFieldConstructor({ id }: { id: number }) {
  const { setProperties } = useConstructorRoot()

  const debouncedUpdateProperties = debounce((newProperties: FieldProperties, id: number) => {
    console.log("sendUpdate")
    setProperties(newProperties, id)
  }, 500)
  return (
    <>
      <div className="flex flex-col">
        <label className="text-[0.9rem]" id={"placeholderInput"}>
          У данного типа поля нет параметров
        </label>
      </div>
    </>
  )
}
