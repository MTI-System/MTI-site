"use client"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { Autocomplete } from "@/components/pickers/AutocompleteWithPreview"
import PersonPicker from "@/components/pickers/PersonPicker"
import { useEffect, useState } from "react"
import { FaTimes } from "react-icons/fa"

// export default function TmpPage() {
//   const [query, setQuery] = useState("")
//   const [items, setItems] = useState<number[]>([1, 2, 3, 4])
//   const [overallItemsCount, setOverallItemsCount] = useState(4)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleMockFetch = async () => {
//     console.log("handleMockFetch")
//     setIsLoading(true)
//     await new Promise((resolve) => setTimeout(resolve, 1000))
//     setItems((oldItems) => [...oldItems, ...oldItems.map((item) => item * Math.random())])
//     setOverallItemsCount(overallItemsCount + items.length)
//     setIsLoading(false)
//   }
//   useEffect(() => {
//     handleMockFetch()
//   }, [query])
//   return (
//     <div>
//       <button onClick={() => setItems([])}><FaTimes /></button>
//       <Autocomplete.Root
//         items={items}
//         isLoading={isLoading}
//         setQuery={setQuery}
//         handleScroll={async () => {
//           await handleMockFetch()
//         }}
//         label="Test"
//         placeholder="Test"
//         classNames={{
//           label: "flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900",
//           input:
//             "bg-[canvas] h-10 w-[16rem] md:w-[20rem] font-normal rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800",
//         }}
//       >
//         <Autocomplete.Portal>
//           <Autocomplete.Positioner className="outline-none" sideOffset={4}>
//           <Autocomplete.Status.Root className="flex items-center gap-2 py-2 pl-4 pr-8 text-sm text-gray-600 top-0 left-0 right-0 bg-bg-alt">
//                 <Autocomplete.Status.Loading>
//                   <>
//                     <div
//                       className="size-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600"
//                       aria-hidden
//                     />
//                     Searching...
//                   </>
//                 </Autocomplete.Status.Loading>
//                 <Autocomplete.Status.Info><p>{items.length} of {overallItemsCount} results</p></Autocomplete.Status.Info>

//               </Autocomplete.Status.Root>
//             <Autocomplete.Popup className="max-h-[min(var(--available-height),23rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain rounded-md bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
              
//               <Autocomplete.Empty className="px-4 py-2 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0">
//                 No tags found.
//               </Autocomplete.Empty>
//               <Autocomplete.List>
//                 {(tag: number) => (
//                   <Autocomplete.Item
//                     key={tag}
//                     className="flex cursor-default py-2 pr-8 pl-4 text-base leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded data-[highlighted]:before:bg-gray-900"
//                     value={tag}
//                   >
//                     {tag}
//                   </Autocomplete.Item>
//                 )}
//               </Autocomplete.List>
//               <Autocomplete.Sentinel className="h-4" scrollMargin="0px 0px" />
//             </Autocomplete.Popup>
//           </Autocomplete.Positioner>
//         </Autocomplete.Portal>
//       </Autocomplete.Root>
//     </div>
//   )
// }

export default function TmpPage() {
  return (
    <div>
      <UsersProviderWrapper>
        <PersonPicker label="Пользователь" placeholder="Выберите пользователя" />
      </UsersProviderWrapper>
    </div>
  )
}