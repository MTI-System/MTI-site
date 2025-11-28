"use client"
import { useContext, useEffect, useState } from "react"
import { EmbeddingTypeInterface } from "@/types/embeddings"
import Loading from "@/app/loading"
import { Popover } from "@base-ui-components/react"
import { useGetAvailableContentTypesQuery } from "@/api/materials/clientApiInterface"
import AddFileField from "../materials/AddFileField"
import { AppendableInfoContext } from "../ui/AppendableInfoContainer"
import UniversalEmbedding from "../materials/UniversalEmbedding"
import { ExpandableImage } from "../materials/ImageEmbeddings"
import UniversalPlayer from "../materials/VideoEmbedding"
import { TextEmbedding } from "../materials/TextEmbedding"

type MaterialInterface = {
  title: string
  content: string
  contentType: EmbeddingTypeInterface
}

// export default function TournamentInformationConstructor() {
//   const [materials, setMaterials] = useState<MaterialInterface[]>([])
//   const { data: contentTypes, error } = useGetAvailableContentTypesQuery({})

//   if (!contentTypes) return <Loading />

//   const dropdownEls = contentTypes.map((item, i) => ({
//     children: <h1>{item.display_name}</h1>,
//     value: item.id,
//   }))
//   return (
//     <>
//       <div className="flex justify-between">
//         <h2 className="text-xl font-medium">Конструктор главной страницы турнира</h2>
//         <Popover.Root>
//           <Popover.Trigger className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-popup-open:bg-gray-100">
//             <div className="aspect-square h-full">?</div>
//           </Popover.Trigger>
//           <Popover.Portal>
//             <Popover.Positioner sideOffset={8} align={"end"}>
//               <Popover.Popup className="origin-(--transform-origin) rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
//                 <Popover.Title className="text-base font-medium">
//                   Конструктор страницы с информацией для участников
//                 </Popover.Title>
//                 <Popover.Description className="text-base text-gray-600">
//                   Соберите всю необходимую информацию для участников.
//                   <br />
//                   Вы можете прикрепить любые виды данных на этой странице.
//                   <br />
//                   <strong>Не забудьте регламент!</strong>
//                   <br />
//                   Эту страницу можно будет редактировать позже
//                 </Popover.Description>
//               </Popover.Popup>
//             </Popover.Positioner>
//           </Popover.Portal>
//         </Popover.Root>
//       </div>

//       <div className="flex flex-col gap-2 py-2">
//         {materials.map((material, index) => (
//           <>
//             <div className="flex flex-col justify-between">
//               <div className="flex justify-between">
//                 <div className="flex gap-2">
//                   <Input
//                     className="border-border h-12 w-120 rounded-full border p-2 text-[0.8rem]"
//                     defaultValue={material.title}
//                   />
//                   <Dropdown
//                     trigger={
//                       <DropdownTrigger
//                         className={twclsx("bg-bg-alt hover:bg-hover h-full w-40 justify-between rounded-full")}
//                       >
//                         {"Текст"}
//                       </DropdownTrigger>
//                     }
//                     onOptionSelect={(option: DropdownOptionInterface<number> | null) => {
//                       if (!option) return
//                       // problemDispatcher(setYear(option.value))
//                     }}
//                   >
//                     {dropdownEls.map((opts, i) => (
//                       <DropdownElement key={i + 1} {...opts} />
//                     ))}
//                   </Dropdown>
//                 </div>

//                 <button className="mt-2 h-10 w-24 rounded-2xl border border-[#ED0F4E] bg-[#ED0F4E]/20 text-[#ED0F4E] hover:bg-[#ED0F4E]/50">
//                   Удалить
//                 </button>
//               </div>
//               {material.contentType.type_name === "Text" ? (
//                 <>
//                   <textarea
//                     className="border-border mt-2 h-20 w-full resize-none rounded-2xl border p-2 text-xs"
//                     defaultValue={material.content}
//                   ></textarea>
//                 </>
//               ) : (
//                 <h1>Неподходящий тип данных (TODO)</h1>
//               )}
//             </div>
//           </>
//         ))}
//       </div>

//       <button
//         className="bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary mt-2 h-10 w-full rounded-2xl border"
//         onClick={() =>
//           setMaterials([
//             ...materials,
//             {
//               title: "Новый элемент",
//               content: "содержание",
//               contentType: contentTypes[0],
//             },
//           ])
//         }
//       >
//         Добавить раздел
//       </button>
//     </>
//   )
// }

export default function TournamentInformationConstructor() {
  const [materials, setMaterials] = useState<MaterialInterface[]>([])
  const { data: contentTypes, error } = useGetAvailableContentTypesQuery({})

  if (!contentTypes) return <Loading />

  const dropdownEls = contentTypes.map((item, i) => ({
    children: <h1>{item.display_name}</h1>,
    value: item.id,
  }))
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-medium">Конструктор главной страницы турнира</h2>
        <Popover.Root>
          <Popover.Trigger className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-popup-open:bg-gray-100">
            <div className="aspect-square h-full">?</div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align={"end"}>
              <Popover.Popup className="origin-(--transform-origin) rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                <Popover.Title className="text-base font-medium">
                  Конструктор страницы с информацией для участников
                </Popover.Title>
                <Popover.Description className="text-base text-gray-600">
                  Соберите всю необходимую информацию для участников.
                  <br />
                  Вы можете прикрепить любые виды данных на этой странице.
                  <br />
                  <strong>Не забудьте регламент!</strong>
                  <br />
                  Эту страницу можно будет редактировать позже
                </Popover.Description>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="flex flex-col gap-2 py-2">
        {materials.map((material, index) => (
          <></>
        ))}
        <div className="w-120">
          <AddFileField
            onFileSet={(file) => {
              console.log(file)
            }}
            disabled={false}
            accept="*/*"
            isInline={true}
          />
        </div>
      </div>
    </>
  )
}

function InputRow() {
  const { info, setAppendableInfo, isEditable, error } = useContext(AppendableInfoContext)
  if (!isEditable)
    return info.embedding.content_type.type_name === "Picture" ? (
      <ExpandableImage embedding={info.embedding} src={info.embedding.content} />
    ) : info.embedding.content_type.type_name === "Video" ? (
      <UniversalPlayer embedding={info.embedding} />
    ) : info.embedding.content_type.type_name === "Text" ? (
      <TextEmbedding text={info.embedding.content} title={info.embedding.title} />
    ) : info.embedding.content_type.type_name === "Location" ? (
      <>{/* TODO: Location Embedding */}</>
    ) : (
      <UniversalEmbedding embedding={info.embedding} />
    )
  return <></>
}
