"use client"
import { Button, HoldButton } from "@/components/ui/Buttons"
import { EmbeddingTypeInterface } from "@/types/embeddings"
import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  JSX,
  JSXElementConstructor,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react"
import style from "@/styles/components/sections/problems/[id]/embeddingAddition.module.css"
import { RiFileAddLine } from "react-icons/ri"
import Modal from "@/components/ui/Modals"
import ContentContainer from "@/components/ui/ContentContainer"
import AddFileField from "@/components/ui/Files/AddFileField"
import { useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import clsx from "clsx"
// import LoadingFileEmbedding from "@/components/ui/Files/LoadingEmbeddings/LoadingFileEmbedding"
import { LoadFileForm } from "@/types/embeddings"
import { TextDropdown } from "@/components/ui/Dropdown"
import { fetchAddLinkEmbedding, fetchAllAvailableEmbeddingTypes } from "@/scripts/ApiFetchers"
import { useRouter } from "next/navigation"

type FileFromModalInterface = Omit<LoadFileForm, "link">

interface LFEProps {
  form: FileFromModalInterface
  onUploadComplete: () => void
  onUploadCancel: (noWait: boolean) => void
}

export default function PendingEmbeddingsList({
  problemId,
  LoadingFileEmbedding,
  buttonClassName,
  isPrimary,
  lockedContentTypes,
}: {
  problemId: number
  LoadingFileEmbedding: JSXElementConstructor<LFEProps>
  buttonClassName: string
  isPrimary?: boolean
  lockedContentTypes?: string[]
}) {
  const uploadedRef = useRef(0)
  const deleteKeyRef = useRef<string>("")
  const isOpenState = useState(false)
  const [isOpen, setIsOpen] = isOpenState
  const [embeddings, setEmbeddings] = useState<{ [key: string]: FileFromModalInterface }>({})
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    console.log(embeddings)
  }, [embeddings])

  useEffect(() => {
    console.log(deleteKeyRef.current, isPending)
    if (isPending === true || deleteKeyRef.current === "") return
    setEmbeddings((prev) => {
      const newEmbeddingsDict = { ...prev }
      delete newEmbeddingsDict[deleteKeyRef.current]
      return newEmbeddingsDict
    })
  }, [isPending])

  return (
    <>
      {Object.entries(embeddings).map(([key, value]) => (
        <LoadingFileEmbedding
          form={value}
          key={key}
          onUploadComplete={() => {
            console.log("Upload complete")
            deleteKeyRef.current = key
            startTransition(() => {
              router.refresh()
            })
          }}
          onUploadCancel={(noWait) => {
            console.log("upload canceled")
            setTimeout(
              () =>
                setEmbeddings((prev) => {
                  const newEmbeddingsDict = { ...prev }
                  delete newEmbeddingsDict[key]
                  return newEmbeddingsDict
                }),
              noWait ? 0 : 1000
            )
          }}
        />
      ))}
      <Button
        className={buttonClassName}
        // className={style.addMaterialButton}
        style={{ opacity: isPending ? 0.5 : 1 }}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <RiFileAddLine className={style.addIcon} />
        <h4 className={style.addTitle}>Добавить материал</h4>
      </Button>
      <AddFileModal
        problemId={problemId}
        openState={isOpenState}
        onFileAdd={(fileForm) => {
          console.log(fileForm)
          uploadedRef.current += 1
          setEmbeddings((prev) => {
            const newEmbeddingsDict = { ...prev }
            newEmbeddingsDict[uploadedRef.current] = fileForm
            return newEmbeddingsDict
          })
        }}
        startTransition={startTransition}
        isPrimary={isPrimary}
        lockedContentTypes={lockedContentTypes}
      />
    </>
  )
}

enum UploadingErrors {
  EmptyName = "Имя файла не може быть пустым",
  EmptyType = "Пожалуйста, выберите тип файла из раскрывающегося спика",
  UnknownError = "Произошла ошибка во время прикрипления материала",
}

function AddFileModal({
  openState,
  onFileAdd,
  problemId,
  startTransition,
  isPrimary,
  lockedContentTypes,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  onFileAdd: (ffm: FileFromModalInterface) => void
  problemId: number
  startTransition: (trh: () => void) => void
  isPrimary?: boolean
  lockedContentTypes?: string[]
}) {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = openState
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [attachedLink, setAttachedLink] = useState<string | null>(null)
  const [errorText, setErrortext] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const user = useAppSelector((state) => state.auth.authInfo)
  const token = useAppSelector((state) => state.auth.token)
  const [typeList, setTypeList] = useState<EmbeddingTypeInterface[]>([])
  let defaultOptionConstant = { displayName: "Выберите тип файла", value: 0, active: true }
  const [defaultOption, setDefaultOption] = useState(defaultOptionConstant)
  const dataRef = useRef<Omit<FileFromModalInterface, "file" | "link">>({
    materialTitle: "",
    contentType: 0,
    isPrimary: isPrimary ?? false,
    problemId: problemId,
    token: token,
  })

  useEffect(() => {
    fetchAllAvailableEmbeddingTypes().then((response) => {
      if (!lockedContentTypes) {
        setTypeList(response)
        return
      }
      const validOptions = response.filter(
        (value) => lockedContentTypes.find((lctValue) => value.type_name === lctValue) !== undefined
      )
      setTypeList(validOptions)
      defaultOptionConstant = { displayName: validOptions[0].type_name, value: validOptions[0].id, active: true }
      dataRef.current.contentType = validOptions[0].id
    })
  }, [problemId, lockedContentTypes])

  const handleLinkAttach = (text: string) => {
    setAttachedLink(text === "" ? null : text)
    const onlyLinks = typeList.filter((value) => value.type_name == "Link")
    setDefaultOption(
      !attachedLink ? { displayName: onlyLinks[0].type_name, value: onlyLinks[0].id, active: true } : defaultOption
    )
    dataRef.current.contentType = !attachedLink ? onlyLinks[0].id : 0
  }
  const handleTitleSet = (text: string) => {
    if (text === "") {
      setErrortext(UploadingErrors.EmptyName)
      return
    }
    dataRef.current.materialTitle = text
    if (errorText === UploadingErrors.EmptyName) setErrortext("")
  }
  const clearForm = () => {
    setSelectedFile(null)
    setAttachedLink(null)
    dataRef.current.materialTitle = ""
    dataRef.current.isPrimary = false
    setErrortext("")
    setDefaultOption(defaultOption)
    dataRef.current.contentType = 0
  }

  return (
    <Modal
      openState={openState}
      onClose={() => {
        clearForm()
      }}
      preventClose
    >
      <div className={style.modalContentCotainer}>
        {isModalOpen && (
          <>
            <ContentContainer containerTitle="Контент">
              <div className={style.contentSlectContainer}>
                {user?.rights.find((val) => val.right_flag === "ADD_FILES") !== undefined && (
                  <>
                    <AddFileField
                      onFileSet={(f) => {
                        setSelectedFile(f)
                        console.log(f)
                      }}
                      disabled={attachedLink !== null}
                    />
                    <h1 className={style.bigOR}>ИЛИ</h1>
                  </>
                )}
                <TextInput
                  disabled={selectedFile !== null}
                  placeholder="Добавить ссылку на ресурс"
                  className={clsx(style.input, style.linkInput)}
                  onChange={(e) => {
                    const newVal = e.target.value
                    if (!newVal) {
                      setAttachedLink(null)
                      return
                    }
                    if (attachedLink === null) setAttachedLink("")
                  }}
                  onEnter={handleLinkAttach}
                  onBlur={handleLinkAttach}
                />
              </div>
            </ContentContainer>
            <ContentContainer containerTitle="Настройки">
              <div className={style.additionalDataContainer}>
                <div>{errorText !== "" && <p className={style.errorText}>{errorText}</p>}</div>
                <div className={style.typeSettingsContainer}>
                  <TextInput
                    placeholder="Введите имя файла"
                    className={clsx(style.input, style.filename)}
                    onEnter={handleTitleSet}
                    onBlur={handleTitleSet}
                  />
                  <TextDropdown
                    className={style.typeSelectDropdown}
                    options={typeList.map((value) => ({ displayName: value.type_name, value: value.id, active: true }))}
                    defaultSelection={defaultOption}
                    onOptionSelect={(opt) => {
                      dataRef.current.contentType = opt ?? 0
                      const newOpt = typeList.find((value) => opt === value.id)
                      if (newOpt === undefined) return
                      setDefaultOption({ displayName: newOpt.type_name, value: newOpt.id, active: true })
                      if (errorText === UploadingErrors.EmptyType) setErrortext("")
                    }}
                  ></TextDropdown>
                </div>
              </div>
            </ContentContainer>
            <div className={style.confirmButtons}>
              <HoldButton
                style={{ "--main-color": "var(--warning-accent)", "--main-light-color": "var(--alt-warning-accent)" }}
                onConfirm={() => {
                  clearForm()
                  setIsModalOpen(false)
                }}
                disabled={isLoading}
              >
                Отмена
              </HoldButton>
              <Button
                onClick={async () => {
                  if (dataRef.current.materialTitle === "") {
                    setErrortext(UploadingErrors.EmptyName)
                    return
                  }
                  if (typeList.find((value) => dataRef.current.contentType === value.id) === undefined) {
                    setErrortext(UploadingErrors.EmptyType)
                    return
                  }
                  if (attachedLink) {
                    setIsLoading(true)
                    const res = await fetchAddLinkEmbedding({ link: attachedLink, ...dataRef.current })
                    setIsLoading(false)
                    if (res) {
                      setIsModalOpen(false)
                      clearForm()
                      startTransition(() => {
                        router.refresh()
                      })
                      return
                    }
                    setErrortext(UploadingErrors.UnknownError)
                    return
                  }
                  onFileAdd({
                    file: selectedFile,
                    ...dataRef.current,
                  })
                  setIsModalOpen(false)
                  clearForm()
                }}
                disabled={
                  (!selectedFile && !attachedLink) ||
                  (errorText !== "" && errorText !== UploadingErrors.UnknownError) ||
                  isLoading
                }
              >
                Добавить
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onBlur"> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onEnter?: (text: string) => void
  onBlur?: (text: string) => void
}
function TextInput({ onChange, onEnter, onBlur, ...rest }: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <input
      ref={inputRef}
      onChange={(e) => {
        onChange && onChange(e)
      }}
      onKeyUp={(e) => {
        if (e.key !== "Enter") return
        if (onEnter && inputRef.current) onEnter(inputRef.current.value)
        inputRef.current?.blur()
      }}
      onBlur={() => {
        if (onBlur && inputRef.current) onBlur(inputRef.current.value)
      }}
      {...rest}
    />
  )
}
