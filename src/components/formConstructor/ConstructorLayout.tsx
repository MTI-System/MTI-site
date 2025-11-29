"use client"
import { useConstructorRoot } from "@/components/formConstructor/root/RootContext"
import { Constructor } from "./index.parts"
import { useRef } from "react"
import { DragDropProvider } from "@dnd-kit/react"
import { move } from "@dnd-kit/helpers"

export function ConstructorLayout() {
  const { fields, addField, setFields } = useConstructorRoot()
  const counter = useRef<number>(0)
  return (
    <>
      <div className="bg-bg-alt relative h-fit w-full pt-2">
        <DragDropProvider
          onDragEnd={(e) => {
            setFields(move(fields, e))
          }}
        >
          <ul>
            {fields.map((field, index) => (
              <Constructor.Item key={field.id} index={index} id={field.id} field={field} />
            ))}
          </ul>
        </DragDropProvider>
        <div className="flex gap-2">
          <button
            className={"bg-accent-primary/30 px-2 py-1 border border-accent-primary y rounded-md hover:bg-accent-primary/50"}
            onClick={() => {
              addField("Новое поле", counter.current)
              counter.current += 1
            }}
          >
            Добавить поле
          </button>
          <button
            className={"bg-accent-primary/30 px-2 py-1 border border-accent-primary y rounded-md hover:bg-accent-primary/50"}
            onClick={() => {
              console.log(fields)
            }}
          >
            Подтвердить изменение
          </button>
        </div>

      </div>
    </>
  )
}
