import {useSortable} from "@dnd-kit/react/sortable";
import {useRef} from "react";
import {PiDotsNineBold} from "react-icons/pi";


export function ConstructorItem({id, index, title}: { index: number, id: number, title: string }) {
  const handleRef = useRef<HTMLInputElement | null>(null)
  const {ref} = useSortable({
    id, index, handle: handleRef
  })

  return (
    <>
      <li>
        <div ref={ref} className="flex justify-between w-full bg-bg-main-accent my-2 border border-border items-center px-2 text-text-main text-[16px] rounded-xl py-2 px-2">
          <div>
            <div className="flex gap-2">
              <h3>Название поля</h3>
              <p>Дропдаун</p>
            </div>

            <p className="text-[22px] font-bold text-text-alt">{title}</p>
          </div>

          <div ref={handleRef} className="size-10 cursor-grab"><PiDotsNineBold size="100%" /></div>
        </div>

      </li>

    </>
  )
}