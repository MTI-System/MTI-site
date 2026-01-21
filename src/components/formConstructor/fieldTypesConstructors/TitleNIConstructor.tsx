import { FieldProperties, useConstructorRoot, TitileNIProperties } from "@/components/formConstructor/root/RootContext"
import { debounce } from "next/dist/server/utils"

export default function TitleNIConstructor({ id }: { id: number }) {
  const { setProperties, getFieldById } = useConstructorRoot()
  const field = getFieldById(id)

  const debouncedUpdateProperties = debounce((newProperties: FieldProperties, id: number) => {
    setProperties(newProperties, id)
  }, 500)
  return (
    <>
      <div className="flex flex-col">
        <label className="text-[0.9rem]" id={"placeholderInput"}>
          Введите текст подзаголовка
        </label>
        <input
          onInput={(e) => {
            debouncedUpdateProperties({ fieldType: "title_ni", subtitle: e.currentTarget.value }, id)
          }}
          className="border-border rounded-lg border ps-2"
          placeholder={"подзаголовок"}
          id={"placeholderInput"}
          //@ts-ignore
          defaultValue={field?.properties.placeholder}
        />
      </div>
    </>
  )
}
