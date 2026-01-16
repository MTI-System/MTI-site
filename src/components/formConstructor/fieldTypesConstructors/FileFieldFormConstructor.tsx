import { debounce } from "next/dist/server/utils"
import { FileInputProperties, useConstructorRoot } from "../root/RootContext"

export default function FileFieldFormConstructor({ id }: { id: number }) {
  const { getFieldById, setProperties } = useConstructorRoot()
  const currentProperties = getFieldById(id)?.properties as FileInputProperties
  const debouncedUpdateProperties = debounce((newProperties: FileInputProperties, id: number) => {
    console.log("sendUpdate", newProperties)
    setProperties(newProperties, id)
  }, 500)
  return (
    <div>
      <p className="text-text-alt text-[22px] font-bold">Файл</p>
      <div className="flex flex-col">
        <label className="text-[0.9rem]" id={"acceptInput"}>
          Допустимые типы файлов
        </label>
        <input
          onInput={(e) => {
            debouncedUpdateProperties({ ...currentProperties, fieldType: "file", accept: e.currentTarget.value }, id)
          }}
          className="border-border rounded-lg border ps-2"
          placeholder=".pdf, .docx, .xlsx, .pptx, .txt, .csv, .json, .xml, .html, .css, .js, .php, .py, .java, .cpp, .c, .h, .hpp, .hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.hxx, *.h???"
          id={"acceptInput"}
          defaultValue={currentProperties.accept}
        />
      </div>
    </div>
  )
}
