"use client"
import {useConstructorRoot} from "@/components/formConstructor/root/RootContext";
import {Constructor} from "./index.parts";
import {useRef} from "react";
import {DragDropProvider} from "@dnd-kit/react";
import {move} from '@dnd-kit/helpers';

export function ConstructorLayout() {
  const {fields, addField, setFields} = useConstructorRoot()
  const counter = useRef<number>(0);
  return (
    <>
      <div className="relative bg-bg-alt w-full h-[100vh] pt-2">
        <DragDropProvider onDragEnd={(e)=>{
          setFields(move(fields, e))
        }}>
          <ul>
            {fields.map((field, index) => (
              <Constructor.Item key={field.id} index={index} id={field.id} field={field}/>
            ))}
          </ul>
        </DragDropProvider>

        <button onClick={() => {
          addField("Новое поле", counter.current);
          counter.current += 1
        }}>
          click me
        </button>
        <button onClick={() => {
          console.log(fields)
        }}>!!Verify form!!</button>
      </div>
    </>
  )
}