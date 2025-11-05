import {useSortable} from "@dnd-kit/react/sortable";


export function ConstructorItem({id, index}: { id: number, index: number }) {
  const {ref} = useSortable({
    id, index
  })
  return (
    <>
      <li>
        <div ref={ref} className="w-full h-15 bg-white">{id}</div>
      </li>

    </>
  )
}