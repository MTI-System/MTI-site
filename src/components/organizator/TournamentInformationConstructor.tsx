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
import { useSelector } from "react-redux"
import TextareaAutosize from "react-textarea-autosize"

export interface PendingInterface {
  pendingContent?: string | File | null
  pendingMetadata?: EmbeddingmetadataInterface
  content_type?: EmbeddingTypeInterface | null
  pendingTitle?: string | null
  id: number
}

export type MaterialsStateBaseType = (EmbeddingInterface | PendingInterface)[]

export default function TournamentInformationConstructor({
  materialsState,
}: {
  materialsState: [MaterialsStateBaseType, Dispatch<SetStateAction<MaterialsStateBaseType>>]
}) {
  const [materials, setMaterials] = materialsState

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
      <div className="flex flex-col gap-4 py-2">
        {materials.map((material, index) => (
          <AppendableInfoContainer
            key={material.id}
            prevInfoInitial={material}
            onInfoChange={(info) => handleEditDone(info, material.id)}
            onRemove={() => {
              // console.log(material.id, materials)
              setMaterials((prev) => {
                return prev.filter((v) => v.id !== material.id)
              })
              return undefined
            }}
            className="flex flex-row justify-between gap-2"
            btnDivClassName="flex flex-row justify-between gap-2"
            btnClassName="max-h-22 h-full w-20 rounded-xl border-2 flex items-center justify-center text-2xl"
            addClassName="text-accent-primary border-accent-primary bg-accent-primary-alt"
            editClassName="text-accent-primary border-accent-primary bg-accent-primary-alt"
            deleteClassName="text-accent-warning border-accent-warning bg-accent-warning-alt"
            confirmClassName="text-accent-accept border-accent-accept bg-accent-accept-alt"
            discardClassName="text-accent-warning border-accent-warning bg-accent-warning-alt"
          >
            <InputRow />
          </AppendableInfoContainer>
        ))}
        {materials.length > 0 && <div className="border-border w-full border-2 border-b"></div>}
        <AppendableInfoContainer
          key={materials.length}
          onInfoChange={handleEditDone}
          className="flex flex-row justify-between gap-2"
          btnDivClassName="flex flex-row justify-between gap-2"
          btnClassName="max-h-22 h-full w-20 rounded-xl border-2 flex items-center justify-center text-2xl"
          addClassName="text-accent-primary border-accent-primary bg-accent-primary-alt w-42"
          editClassName="text-accent-primary border-accent-primary bg-accent-primary-alt"
          deleteClassName="text-accent-warning border-accent-warning bg-accent-warning-alt"
          confirmClassName="text-accent-accept border-accent-accept bg-accent-accept-alt"
          discardClassName="text-accent-warning border-accent-warning bg-accent-warning-alt"
        >
          <InputRow />
        </AppendableInfoContainer>
      </div>
    </>
  )
}

function InputRow() {
  const { info, setAppendableInfo, isEditable, error } = useContext(AppendableInfoContext)
  // TODO: Add error handling

  if (!isEditable)
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
    <div className="flex w-full flex-row justify-between gap-2">
      <EmbeddingInput
        defaultValue={info.pendingContent ?? info.embedding?.content ?? null}
        contentType={info.content_type}
        onContentUpdate={(content) => {
          setAppendableInfo({ pendingContent: content })
          if (["Picture", "Video", "Document"].includes(info.content_type.type_name) && content instanceof File)
            setAppendableInfo({ pendingMetadata: { file_size: content.size.toFixed(2), is_external: "false" } })
          if (info.content_type.type_name === "Link") setAppendableInfo({ pendingMetadata: { is_external: "true" } })
        }}
      />
      <div className="flex w-fit flex-col justify-start gap-2">
        <Input
          className="border-border h-10 w-full rounded-md border p-2 text-sm text-gray-900"
          placeholder="Заголовок"
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
      <TextareaAutosize
        className="border-border text-text-main w-full max-w-200 resize-none rounded-md border p-2 text-sm"
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        onChange={(e) => {
          onContentUpdate(e.target.value)
        }}
      ></TextareaAutosize>
    )
  else if (contentType?.type_name === "Link")
    return (
      <Input
        className="border-border text-text-main text-md field-sizing-content h-fit w-full max-w-200 rounded-md border px-2 pt-2 pb-14"
        placeholder="Ссылка"
        value={typeof defaultValue === "string" ? defaultValue : ""}
        onChange={(e) => {
          onContentUpdate(e.target.value)
        }}
      ></Input>
    )
  else if (contentType?.type_name === "Location") return <p>Location {/*TODO: Add location picker*/}</p>
  else
    return (
      <div className="w-full max-w-200">
        <AddFileField
          defaultValue={typeof defaultValue === "string" ? null : defaultValue}
          onFileSet={(file) => {
            onContentUpdate(file)
          }}
          disabled={false}
          accept={contentType?.allowed_mime_types ?? "*/*"}
          isInline={true}
        />
      </div>
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

  if (isLoading)
    return (
      <p className="border-border h-10 w-full rounded-md border p-2 text-center text-sm text-gray-500">Loading...</p>
    )
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
      <Select.Trigger className="border-border flex h-10 w-full min-w-fit cursor-default items-center justify-between gap-3 rounded-md border pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:bg-gray-100">
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
    <div className="h-full w-full">
      <p className="text-text-main pb-2 text-3xl font-bold">{pendingTitle ?? ""}</p>
      <img src={url} alt={pendingTitle ?? ""}></img>
      {/* TODO: Picture Embedding */}
    </div>
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
    <div className="h-full w-full">
      <p className="text-text-main pb-2 text-3xl font-bold">{pendingTitle ?? ""}</p>
      <video src={url}></video>
      {/* TODO: Video Embedding */}
    </div>
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
        metadata: { is_external: "false", ...pendingMetadata },
      }}
    />
  )
}
