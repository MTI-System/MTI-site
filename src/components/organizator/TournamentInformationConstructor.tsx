"use client"
import { CSSProperties, Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react"
import { EmbeddingInterface, EmbeddingmetadataInterface, EmbeddingTypeInterface } from "@/types/embeddings"
import { Input, Popover, Select } from "@base-ui-components/react"
import { useGetAvailableContentTypesQuery, useAddMaterialMutation } from "@/api/materials/clientApiInterface"
import AddFileField from "../materials/AddFileField"
import AppendableInfoContainer, { AppendableInfoContext, EditError } from "../ui/AppendableInfoContainer"
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
import { string } from "zod"

export interface PendingInterface {
  pendingContent?: string | File | null
  pendingMetadata?: EmbeddingmetadataInterface
  content_type?: EmbeddingTypeInterface | null
  pendingTitle?: string | null
  isLoading: boolean
  id: number
}

export type MaterialsStateBaseType = (EmbeddingInterface | PendingInterface)[]

export default function TournamentInformationConstructor({
  materialsState,
}: {
  materialsState: [MaterialsStateBaseType, Dispatch<SetStateAction<MaterialsStateBaseType>>]
}) {
  const [materials, setMaterials] = materialsState
  console.log(materials)

  const handleEditDone = (info: { [key: string]: any }, editIdx?: number): EditError[] => {
    const errors = []
    if (!info.pendingContent) errors.push({ key: "pendingContent", message: "" })
    if (!info.content_type) errors.push({ key: "content_type", message: "" })
    if (!info.pendingTitle) errors.push({ key: "pendingTitle", message: "" })
    console.log(info, errors)
    if (errors.length > 0) return errors
    setMaterials((prev) => {
      const newArr = [...prev]
      const idx = editIdx ?? -(prev.length + 1)
      const pendingObj: PendingInterface = {
        pendingContent: info.pendingContent,
        pendingMetadata: info.pendingMetadata,
        content_type: info.content_type,
        pendingTitle: info.pendingTitle,
        isLoading: true,
        id: idx,
      }
      if (editIdx) {
        const arrIdx = newArr.findIndex((v) => v.id === idx)
        if (arrIdx !== -1) newArr[arrIdx] = pendingObj
      } else {
        newArr.push(pendingObj)
      }
      return newArr
    })
    return []
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
          <AppendableInfoContainer
            key={index}
            prevInfoInitial={material}
            onInfoChange={(info) => handleEditDone(info, material.id)}
            onRemove={() => {
              // console.log(material.id, materials)
              setMaterials((prev) => {
                return prev.filter((v) => v.id !== material.id)
              })
              return undefined
            }}
            className="flex flex-row justify-between"
            btnDivClassName="flex flex-row justify-between"
            btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
          >
            <InputRow />
          </AppendableInfoContainer>
        ))}
        <AppendableInfoContainer
          key={materials.length}
          onInfoChange={handleEditDone}
          className="flex flex-row justify-between"
          btnDivClassName="flex flex-row justify-between"
          btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
        >
          <InputRow />
        </AppendableInfoContainer>
      </div>
    </>
  )
}

function InputRow() {
  const { info, setAppendableInfo, isEditable, error } = useContext(AppendableInfoContext)

  const token = useSelector((state: any) => state.auth.token)
  if (!isEditable)
    // TODO: Add display of pending object s and remove file upload from here
    return info.pendingContent ? (
      info.content_type?.type_name === "Text" ? (
        <TextEmbedding text={info.pendingContent as string} title={info.pendingTitle as string} />
      ) : info.content_type?.type_name === "Location" ? (
        <>{/* TODO: Location Embedding */}</>
      ) : info.content_type?.type_name === "Picture" ? (
        <PendingPictureEmbedding
          pendingContent={info.pendingContent as File | null}
          pendingTitle={info.pendingTitle as string | null}
        />
      ) : info.content_type?.type_name === "Video" ? (
        <PendingVideoEmbedding
          pendingContent={info.pendingContent as File | null}
          pendingTitle={info.pendingTitle as string | null}
        />
      ) : (
        <ProblemsProviderWrapper>
          <PendingUniversalEmbedding
            pendingContent={info.pendingContent as string | File | null}
            pendingTitle={info.pendingTitle as string | null}
            pendingContentType={info.content_type as EmbeddingTypeInterface | null}
            pendingMetadata={info.pendingMetadata}
          />
        </ProblemsProviderWrapper>
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
        defaultValue={info.pendingContent ?? info.embedding?.content ?? null}
        contentType={info.content_type}
        onContentUpdate={(content) => {
          setAppendableInfo({ pendingContent: content })
          if (["Picture", "Video", "Document"].includes(info.content_type.type_name) && content instanceof File)
            setAppendableInfo({ pendingMetadata: { file_size: content.size.toFixed(2) } })
        }}
      />
      <div className="flex flex-row justify-end gap-2">
        <Input
          className="border-border h-10 w-full rounded-md border p-2 text-sm text-gray-900"
          placeholder="Название"
          value={info.pendingTitle ?? info.embedding?.title ?? ""}
          onChange={(e) => {
            setAppendableInfo({ pendingTitle: e.target.value })
          }}
        />
        <EmbeddingTypeSelector
          defaultValue={info.pendingContent ? info.content_type?.id : info.embedding?.content_type?.id}
          onSelect={(v) => {
            setAppendableInfo({ content_type: v })
          }}
        />
      </div>
    </div>
  )
}

function EmbeddingInput({
  defaultValue,
  contentType,
  onContentUpdate,
}: {
  defaultValue: string | File | null
  contentType: EmbeddingTypeInterface | undefined
  onContentUpdate: (content: string | File | null) => void
}) {
  if (contentType?.type_name === "Text")
    return (
      <textarea
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        onChange={(e) => {
          onContentUpdate(e.target.value)
        }}
      ></textarea>
    )
  else if (contentType?.type_name === "Link")
    return (
      <input
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        onChange={(e) => {
          onContentUpdate(e.target.value)
        }}
      ></input>
    )
  else if (contentType?.type_name === "Location") return <p>Location {/*TODO: Add location picker*/}</p>
  else
    return (
      <AddFileField
        defaultValue={typeof defaultValue === "string" ? null : defaultValue}
        onFileSet={(file) => {
          onContentUpdate(file)
        }}
        disabled={false}
        accept={contentType?.allowed_mime_types ?? "*/*"}
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
  const undefinedDefaultID = 1
  const { data, isLoading, isSuccess, error } = useGetAvailableContentTypesQuery({})
  const availableTypes = data?.map((v) => ({ label: v.display_name, value: v.id })) ?? []

  const [selectedValue, setSelectedValue] = useState<number | null>(0)

  // TODO: add error handling
  useEffect(() => {
    if (isLoading) return
    if (isSuccess) {
      const defSel = data?.find((v) => v.id === defaultValue) ?? data?.find((v) => v.id === undefinedDefaultID)
      onSelect(defSel)
      setSelectedValue(defSel?.id ?? null)
    }
  }, [isLoading, isSuccess])

  if (isLoading) return <p>Loading...</p>
  return (
    <Select.Root
      items={availableTypes}
      value={selectedValue}
      onValueChange={(value) => {
        setSelectedValue(value)
        if (value !== null) {
          onSelect(data?.find((v) => v.id === value))
        }
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

function PendingPictureEmbedding({
  pendingContent,
  pendingTitle,
}: {
  pendingContent: File | null
  pendingTitle: string | null
}) {
  const url = useMemo(
    () => (pendingContent ? URL.createObjectURL(pendingContent) : "/placeholder.png"),
    [pendingContent],
  )
  return (
    <>
      <img src={url} alt={pendingTitle ?? ""}></img>
      {/* TODO: Picture Embedding */}
    </>
  )
}

function PendingVideoEmbedding({
  pendingContent,
  pendingTitle,
}: {
  pendingContent: File | null
  pendingTitle: string | null
}) {
  const url = useMemo(
    () => (pendingContent ? URL.createObjectURL(pendingContent) : "/placeholder.png"),
    [pendingContent],
  )
  return (
    <>
      <video src={url}></video>
      {/* TODO: Video Embedding */}
    </>
  )
}

function PendingUniversalEmbedding({
  pendingContent,
  pendingTitle,
  pendingContentType,
  pendingMetadata,
}: {
  pendingContent: string | File | null
  pendingTitle: string | null
  pendingContentType: EmbeddingTypeInterface | null
  pendingMetadata: EmbeddingmetadataInterface
}) {
  console.log(pendingMetadata)
  return (
    <UniversalEmbedding
      embedding={{
        id: 0,
        title: pendingTitle ?? "",
        content: pendingContent as string,
        content_type: pendingContentType ?? {
          id: 1,
          type_name: "Unknown",
          icon_source: "FileTemplateUnknwon.svg",
          display_name: "Руизвестный тип",
          allowed_mime_types: "",
        },
        metadata: { ...pendingMetadata, is_external: "false" },
      }}
    />
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
