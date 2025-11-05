import {ConstructorItem} from "@/components/formConstructor/ConstructorItem";
import {useSortable} from "@dnd-kit/react/sortable";

export function ConstructorLayout() {
  const items = [1, 2, 3, 4];
  return (
    <>
      <div className="relative bg-black w-full h-[100vh]">
        <ul>
          {items.map((id, index) =>
            <ConstructorItem key={id} id={id} index={index}/>
          )}
        </ul>
      </div>
    </>
  )
}