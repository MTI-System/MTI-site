import {ConstructorItem} from "@/components/formConstructor/ConstructorItem";
import {useSortable} from "@dnd-kit/react/sortable";

export function ConstructorLayout() {
  const items = [1, 2, 3, 4];
  return (
    <>
      <div className="relative bg-bg-alt w-full h-[100vh] pt-2" >
        <ul>
          {items.map((id, index) =>
            <ConstructorItem key={id} id={id} index={index} title={"Название поля"}/>
          )}
        </ul>
      </div>
    </>
  )
}