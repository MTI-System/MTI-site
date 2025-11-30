"use client"
import { CSSProperties, useContext, useEffect, useRef, useState } from "react"
import { EmbeddingInterface, EmbeddingmetadataInterface, EmbeddingTypeInterface } from "@/types/embeddings"
import Loading from "@/app/loading"
import { Input, Popover, Select } from "@base-ui-components/react"
import { useGetAvailableContentTypesQuery, useAddMaterialMutation } from "@/api/materials/clientApiInterface"
import AddFileField from "../materials/AddFileField"
import AppendableInfoContainer, { AppendableInfoContext } from "../ui/AppendableInfoContainer"
import UniversalEmbedding from "../materials/UniversalEmbedding"
import { ExpandableImage } from "../materials/ImageEmbeddings"
import UniversalPlayer from "../materials/VideoEmbedding"
import { TextEmbedding } from "../materials/TextEmbedding"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import { RiExpandUpDownFill } from "react-icons/ri"
import { FaCheck } from "react-icons/fa6"
import { EmbeddingCard } from "../materials/FileEmbeddings"
import { MdOutlineClose, MdOutlineRefresh } from "react-icons/md"
import axios from "axios"
import { FILES_API, MATERIAL_API } from "@/constants/APIEndpoints"
import { useSelector } from "react-redux"

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

interface PendingInterface {
  pendingContent?: string | File | null
  pendingMetadata?: EmbeddingmetadataInterface
  dstType?: EmbeddingTypeInterface | null
  pendingTitle?: string | null
  isLoading: boolean
  id: number
}

export default function TournamentInformationConstructor() {
  const [materials, setMaterials] = useState<(MaterialInterface | PendingInterface)[]>([])
  const [addMaterial] = useAddMaterialMutation()

  const handleEditDone = (info: { [key: string]: any }, editIdx?: number) => {
    const errors = []
    if (!info.pendingContent) errors.push({ key: "pendingContent", message: "" })
    if (!info.dstType) errors.push({ key: "dstType", message: "" })
    if (!info.pendingTitle) errors.push({ key: "pendingTitle", message: "" })
    if (errors.length > 0) return errors
    if (info.dstType.type_name === "Text" || info.dstType.type_name === "Location") {
      setMaterials((prev) => {
        const newArr = [...prev]
        const idx = editIdx ?? -(prev.length + 1)
        const pendingObj: PendingInterface = {
          pendingContent: info.pendingContent,
          dstType: info.dstType,
          pendingTitle: info.pendingTitle,
          isLoading: true,
          id: idx
        }
        if (editIdx) newArr[newArr.findIndex(v=>v.id === idx)]
        return newArr
      })
      
    }
  }

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
        <AppendableInfoContainer
          prevInfoInitial={{
            embedding: {
              id: 0,
              title: "Test",
              content: "http://11.0.0.1:5002/files/get/Рисунок6_1.jpg",
              content_type: { id: 4, type_name: "Picture", extension_color: "" },
              metadata: { is_external: "false", is_primary: "true" },
            },
          }}
          className="flex flex-row justify-between"
          btnDivClassName="flex flex-row justify-between"
          btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
        >
          <InputRow onUploadComplete={() => {}} onUploadError={() => {}} />
        </AppendableInfoContainer>
      </div>
    </>
  )
}

function InputRow({
  onUploadComplete,
  onUploadError,
}: {
  onUploadComplete: (filename: string) => void
  onUploadError: () => void
}) {
  const { info, setAppendableInfo, isEditable, error } = useContext(AppendableInfoContext)

  const token = useSelector((state: any) => state.auth.token)
  if (!isEditable)
    return info.isLoading ? (
      <p>Loading...</p>
    ) : info.pendingContent ? (
      info.dstType?.type_name === "Text" || info.dstType?.type_name === "Location" ? (
        <>
          <p>12345</p>
          {/* TODO: Text and location Embedding */}
        </>
      ) : (
        <LoadingFileEmbedding
          file={info.pendingContent}
          token={token}
          displayTitle={info.pendingTitle}
          onUploadComplete={(filename) => {
            setAppendableInfo({ pendingContent: null })
            onUploadComplete(filename)
          }}
          onUploadCancel={(noWait) => {
            setAppendableInfo({ pendingContent: null })
            onUploadError()
          }}
        />
      )
    ) : info.embedding.content_type.type_name === "Picture" ? (
      <ProblemsProviderWrapper>
        <ExpandableImage embedding={info.embedding} src={info.embedding.content} />
      </ProblemsProviderWrapper>
    ) : info.embedding.content_type.type_name === "Video" ? (
      <ProblemsProviderWrapper>
        <UniversalPlayer embedding={info.embedding} />
      </ProblemsProviderWrapper>
    ) : info.embedding.content_type.type_name === "Text" ? (
      <TextEmbedding text={info.embedding.content} title={info.embedding.title} />
    ) : info.embedding.content_type.type_name === "Location" ? (
      <>{/* TODO: Location Embedding */}</>
    ) : (
      <ProblemsProviderWrapper>
        <UniversalEmbedding embedding={info.embedding} />
      </ProblemsProviderWrapper>
    )
  return (
    <div className="flex w-full flex-row justify-between">
      <EmbeddingInput
        contentType={info.dstType}
        onContentUpdate={(content) => {
          setAppendableInfo({ pendingContent: content })
        }}
      />
      <div className="flex flex-row justify-end gap-2">
        <Input
          className="border-border h-10 w-full rounded-md border p-2 text-sm text-gray-900"
          placeholder="Название"
          defaultValue={info.embedding.title}
          onChange={(e) => {
            setAppendableInfo({ pendingTitle: e.target.value })
          }}
        />
        <EmbeddingTypeSelector
          defaultValue={info.embedding.content_type.id}
          onSelect={(v) => {
            setAppendableInfo({ dstType: v })
          }}
        />
      </div>
    </div>
  )
}

function EmbeddingInput({
  contentType,
  onContentUpdate,
}: {
  contentType: EmbeddingTypeInterface | undefined
  onContentUpdate: (content: string | File | null) => void
}) {
  if (contentType?.type_name === "Text")
    return (
      <textarea
        onChange={(e) => {
          onContentUpdate(e.target.value)
        }}
      ></textarea>
    )
  else if (contentType?.type_name === "Link")
    return (
      <input
        onChange={(e) => {
          onContentUpdate(e.target.value)
        }}
      ></input>
    )
  else if (contentType?.type_name === "Location") return <p>Location {/*TODO: Add location picker*/}</p>
  else
    return (
      <AddFileField
        onFileSet={(file) => {
          onContentUpdate(file)
        }}
        disabled={false}
        accept="*/*"
        isInline={true}
      />
    )
}

function EmbeddingTypeSelector({
  onSelect,
  defaultValue,
}: {
  onSelect: (selection: EmbeddingTypeInterface | undefined) => void
  defaultValue: number
}) {
  const { data, isLoading, isSuccess, error } = useGetAvailableContentTypesQuery({})
  const availableTypes = data?.map((v) => ({ label: v.display_name, value: v.id })) ?? []
  // TODO: add error handling

  if (isLoading) return <p>Loading...</p>
  return (
    <Select.Root
      items={availableTypes}
      // defaultValue={availableTypes.find((v)=>v.value == defaultValue)?.label ?? "Выберите тип"}
      defaultValue={availableTypes.find((v)=>v.value===defaultValue)?.value ?? 1}
      onValueChange={(value) => {
        onSelect(data?.find((v) => v.id === value))
      }}
    >
      <Select.Trigger className="flex h-10 w-fit min-w-36 cursor-default items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:bg-gray-100">
        <Select.Value />
        <Select.Icon className="flex">
          <RiExpandUpDownFill />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
          <Select.Popup className="group origin-(--transform-origin) rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none dark:shadow-none dark:outline-gray-300">
            <Select.ScrollUpArrow className="top-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-top-full" />
            <Select.List className="relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1">
              {availableTypes.map(({ label, value }) => (
                <Select.Item
                  key={label}
                  value={value}
                  className="grid min-w-(--anchor-width) cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                >
                  <Select.ItemIndicator className="col-start-1">
                    <FaCheck />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow className="bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-bottom-full" />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}

function LoadingFileEmbedding({
  file,
  token,
  displayTitle,
  onUploadComplete,
  onUploadCancel,
}: {
  file: File
  token: string
  displayTitle: string
  onUploadComplete: (filepath: string) => void
  onUploadCancel: (noWait: boolean) => void
}) {
  const [isError, setIsError] = useState(false)
  const progresRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState<number>(0)
  const abortControllerRef = useRef<AbortController>(null)
  const formData = new FormData()
  formData.set("file", file)
  formData.set("token", token)

  const uploadFile = () => {
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    axios
      .post(FILES_API + "add_material", formData, {
        onUploadProgress: (event) => {
          if (!event.progress) return
          progresRef.current?.style.setProperty("--progress-shift", `${event.progress * 100 - 100}%`)
          setProgress(event.progress * 100)
        },
        signal: abortController.signal,
      })
      .then((data) => {
        if (data.status === 200) {
          progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
          progresRef.current?.style.setProperty("--progress-color", "#00FF00")
          data.data
            .json()
            .then((data: { filename: string }) => {
              onUploadComplete(data.filename)
            })
            .catch((error: Error) => {
              console.error("Error parsing JSON", error)
              setIsError(true)
            })
        } else {
          console.error("File loaded with error")
          progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
          progresRef.current?.style.setProperty("--progress-color", "#FF0000")
          setIsError(true)
        }
      })
      .catch((error) => {
        console.error("File loaded with error", error)
        progresRef.current?.style.setProperty("--progress-shift", `${0}%`)
        progresRef.current?.style.setProperty("--progress-color", "#FF0000")
        setIsError(true)
      })
  }

  useEffect(() => {
    uploadFile()
  }, [])

  return (
    <EmbeddingCard
      title={displayTitle}
      subtitle={isError ? "Ошибка" : `Загрузка: ${progress.toFixed(2)}%`}
      embeddingImageURL="/uploading.svg"
    >
      <div className="flex h-full items-center justify-center">
        {isError && (
          <MdOutlineRefresh
            className="hover:text-text-alt"
            onClick={() => {
              setIsError(false)
              uploadFile()
              progresRef.current?.style.setProperty("--progress-shift", `${-100}%`)
              progresRef.current?.style.setProperty("--progress-color", "var(--primary-accent)")
            }}
          />
        )}
        <MdOutlineClose
          className="hover:text-text-alt"
          onClick={() => {
            abortControllerRef.current?.abort()
            onUploadCancel(isError)
          }}
        />
      </div>
      <div
        className="absolute right-0 bottom-0 left-0 h-2 after:absolute after:bottom-0 after:left-(--progress-shift) after:h-2 after:w-full after:bg-(--progress-color) after:transition-all after:duration-250 after:ease-in-out after:content-['']"
        style={{ "--progress-shift": `${-100}%`, "--progress-color": "var(--primary-accent)" } as CSSProperties}
        ref={progresRef}
      ></div>
    </EmbeddingCard>
  )
}
