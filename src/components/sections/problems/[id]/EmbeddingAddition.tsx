"use client"
import { Button } from "@/components/ui/Buttons"
import { EmbeddingTypeInterface } from "@/types/embeddings"
import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  JSX,
  JSXElementConstructor,
  ReactNode,
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
  buttonIcon,
  isPrimary,
  lockedContentTypes,
  onlyOneUpload,
}: {
  problemId: number
  LoadingFileEmbedding: JSXElementConstructor<LFEProps>
  buttonClassName: string
  buttonIcon: ReactNode
  isPrimary?: boolean
  lockedContentTypes?: string[]
  onlyOneUpload?: boolean
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
      {(Object.keys(embeddings).length === 0 || !onlyOneUpload) && (
        <Button
          className={buttonClassName}
          // className={style.addMaterialButton}
          style={{ opacity: isPending ? 0.5 : 1 }}
          onClick={() => {
            setIsOpen(true)
          }}
        >
          {buttonIcon}
          <h4 className={style.addTitle}>Добавить материал</h4>
        </Button>
      )}

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
  NotALink = "URL не корректен",
  EmptyName = "Имя файла не може быть пустым",
  EmptyType = "Пожалуйста, выберите тип файла из раскрывающегося спика",
  UnknownError = "Произошла ошибка во время прикрипления материала",
  InvalidFileType = "Неверный тип файла",
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

  const [embeddingtypes, setEmbeddingtypes] = useState<EmbeddingTypeInterface[] | null>([])
  const [acceptedEmbeddingTypes, setAcceptedEmbeddingTypes] = useState("*")
  const [isModalOpen, setIsModalOpen] = openState
  const [attachedFile, setSelectedFile] = useState<File | null>(null)
  const [attachedLink, setAttachedLink] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string>("")
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
    if (embeddingtypes === null) return
    if (embeddingtypes.length === 0) {
      fetchAllAvailableEmbeddingTypes()
        .then((response) => {
          if (!lockedContentTypes) {
            setEmbeddingtypes(response)
            return
          }

          const validOptions = response.filter(
            (value) => lockedContentTypes.find((lctValue) => value.type_name === lctValue) !== undefined
          )
          setEmbeddingtypes(validOptions)
        })
        .catch(() => {
          setEmbeddingtypes(null)
        })
      return
    }
    setTypeList(embeddingtypes)
  }, [problemId, lockedContentTypes, embeddingtypes])
  useEffect(() => {
    if (embeddingtypes === null) return
    if (!attachedFile) {
      setTypeList(embeddingtypes)
      return
    }
    setTypeList(embeddingtypes.filter((et)=>et.type_name!=="Link"))

  }, [attachedFile])

  const handleLinkAttach = (text: string) => {
    setAttachedLink(text === "" ? null : text)
    if (errorText === UploadingErrors.NotALink) setErrorText("")
  }
  const handleTitleSet = (text: string) => {
    if (text === "") {
      setErrorText(UploadingErrors.EmptyName)
      return
    }
    dataRef.current.materialTitle = text
    if (errorText === UploadingErrors.EmptyName) setErrorText("")
  }
  const clearForm = () => {
    setSelectedFile(null)
    setAttachedLink(null)
    dataRef.current.materialTitle = ""
    dataRef.current.isPrimary = isPrimary ?? false
    setErrorText("")
    setDefaultOption(defaultOptionConstant)
    setAcceptedEmbeddingTypes("*")
    dataRef.current.contentType = 0
  }

  return (
    <Modal
      openState={openState}
      onClose={() => {
        clearForm()
      }}
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
                        if (errorText === UploadingErrors.InvalidFileType) setErrorText("")
                      }}
                      accept={acceptedEmbeddingTypes}
                      disabled={attachedLink !== null}
                    />
                    <h1 className={style.bigOR}>ИЛИ</h1>
                  </>
                )}
                <TextInput
                  disabled={attachedFile !== null}
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
                  maxLength={10000}
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
                    maxLength={255}
                  />
                  <TextDropdown
                    className={style.typeSelectDropdown}
                    options={typeList.map((value) => ({ displayName: value.display_name, value: value.id, active: true }))}
                    defaultSelection={defaultOption}
                    isAlwaysUp={true}
                    onOptionSelect={(opt) => {
                      dataRef.current.contentType = opt ?? 0
                      const newOpt = typeList.find((value) => opt === value.id)
                      if (newOpt === undefined) return
                      setDefaultOption({ displayName: newOpt.display_name, value: newOpt.id, active: true })
                      dataRef.current.contentType = newOpt.id
                      if (errorText === UploadingErrors.EmptyType || errorText === UploadingErrors.InvalidFileType)
                        setErrorText("")
                      setAcceptedEmbeddingTypes(newOpt.allowed_mime_types ?? "*")
                      console.log(newOpt.allowed_mime_types)
                    }}
                  ></TextDropdown>
                </div>
              </div>
            </ContentContainer>
            <div className={style.confirmButtons}>
              <Button
                style={{ "--main-color": "var(--warning-accent)", "--main-light-color": "var(--alt-warning-accent)" }}
                onClick={() => {
                  clearForm()
                  setIsModalOpen(false)
                }}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  if (dataRef.current.materialTitle === "") {
                    setErrorText(UploadingErrors.EmptyName)
                    return
                  }
                  if (typeList.find((value) => dataRef.current.contentType === value.id) === undefined) {
                    setErrorText(UploadingErrors.EmptyType)
                    return
                  }
                  if (attachedLink) {
                    try {
                      new URL(attachedLink)
                    } catch {
                      setErrorText(UploadingErrors.NotALink)
                      return
                    }
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
                    setErrorText(UploadingErrors.UnknownError)
                    return
                  }
                  const fileType = attachedFile?.type
                  console.log(
                    fileType,
                    embeddingtypes,
                    embeddingtypes?.find((value) => value.id === dataRef.current.contentType)
                  )
                  const allowed_types = embeddingtypes
                    ?.find((value) => value.id === dataRef.current.contentType)
                    ?.allowed_mime_types?.split(",")
                  console.log(fileType, allowed_types)
                  if (
                    allowed_types &&
                    allowed_types.find((mimeType) => {
                      if (!fileType) return false
                      const mimeTypeStarIndex = mimeType.indexOf("/*")
                      const filetypeSlashIndex = fileType.indexOf("/")
                      console.log("Check first")
                      console.log(fileType, mimeType)
                      if (mimeTypeStarIndex > 0) {
                        return fileType.slice(0, filetypeSlashIndex) === mimeType.slice(0, mimeTypeStarIndex)
                      }
                      console.log("Check extension")
                      if (mimeType[0] === ".") {
                        return mimeType.slice(1) === fileType.slice(filetypeSlashIndex + 1)
                      }
                      console.log("full check")
                      return fileType === mimeType
                    }) === undefined
                  ) {
                    setErrorText(UploadingErrors.InvalidFileType)
                    return
                  }
                  console.log("Added file with isPrimary:", dataRef.current.isPrimary)
                  onFileAdd({
                    file: attachedFile,
                    ...dataRef.current,
                  })
                  setIsModalOpen(false)
                  clearForm()
                }}
                disabled={
                  (!attachedFile && !attachedLink) ||
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
