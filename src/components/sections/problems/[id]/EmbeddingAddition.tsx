"use client"
import { Button, HoldButton } from "@/components/ui/Buttons"
import UniversalEmbedding from "@/components/ui/Files/FileEmbeddings"
import { EmbeddingInterface, EmbeddingTypeInterface } from "@/types/embeddings"
import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useEffect,
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
import LoadingFileEmbedding from "@/components/ui/Files/LoadingEmbeddings/LoadingFileEmbedding"
import { LoadFileForm } from "@/types/embeddings"
import { TextDropdown } from "@/components/ui/Dropdown"
import TwoPositionalSwitch from "@/components/ui/Switched"
import { fetchAddLinkEmbedding, fetchAllAvailableEmbeddingTypes } from "@/scripts/ApiFetchers"
import { useRouter } from "next/navigation"

type FileFromModalInterface = Omit<LoadFileForm, "link">

export default function PendingEmbeddingsList({ problemId }: { problemId: number }) {
  const isOpenState = useState(false)
  const [isOpen, setIsOpen] = isOpenState
  const [embeddings, setEmbeddings] = useState<FileFromModalInterface[]>([])
  const [isPending, startTransition] = useTransition()
  return (
    <>
      {embeddings[0] && (
        <LoadingFileEmbedding
          form={{
            materialTitle: "Тест добавления",
            contentType: 1,
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlcjEiLCJleHAiOjE3NTQzMDEzODMuOTg2MzQ4OX0.hbYzla1IBct8qinhiX9Pw2pDg0CBheOZ88bgJ9pcCm4",
            file: embeddings[0].file,
            problemId: 11,
            isPrimary: false,
          }}
        />
      )}
      <Button
        className={style.addMaterialButton}
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
        onFileAdd={(file) => {
          // setEmbeddings([{ file }])
        }}
        startTransition={startTransition}
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
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  onFileAdd: (ffm: FileFromModalInterface) => void
  problemId: number
  startTransition: (trh: () => void) => void
}) {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = openState
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [attachedLink, setAttachedLink] = useState<string | null>(null)
  const [errorText, setErrortext] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const user = useAppSelector((state) => state.auth.authInfo)
  const token = useAppSelector((state) => state.auth.token)
  const [typeList, settypeList] = useState<EmbeddingTypeInterface[]>([])

  useEffect(() => {
    fetchAllAvailableEmbeddingTypes().then((response) => {
      settypeList(response)
    })
  }, [])

  const dataRef = useRef<Omit<FileFromModalInterface, "file" | "link">>({
    materialTitle: "",
    contentType: 0,
    isPrimary: false,
    problemId: problemId,
    token: token,
  })

  const handleLinkAttach = (text: string) => {
    setAttachedLink(text === "" ? null : text)
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
    setErrortext("")
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
                {errorText !== "" && <p className={style.errorText}>{errorText}</p>}
                <TextInput
                  placeholder="Введите имя файла"
                  className={clsx(style.input, style.filename)}
                  onChange={(e) => {
                    const newVal = e.target.value
                  }}
                  onEnter={handleTitleSet}
                  onBlur={handleTitleSet}
                />
                <div className={style.typeSettingsContainer}>
                  <TextDropdown
                    className={style.typeSelectDropdown}
                    options={typeList.map((value) => ({ displayName: value.type_name, value: value.id, active: true }))}
                    defaultSelection={{ displayName: "Выберите тип файла", value: null, active: true }}
                    onOptionSelect={(opt) => {
                      dataRef.current.contentType = opt ?? 0
                      if (opt && errorText === UploadingErrors.EmptyType) setErrortext("")
                    }}
                  ></TextDropdown>
                  <div className={style.displayCheckboxContainer}>
                    <p className={clsx(style.displayCheckboxTitle, { [style.disabled]: false })}>
                      Отображать развёрнутым:
                    </p>
                    <TwoPositionalSwitch defaultState={false} onChange={(val) => (dataRef.current.isPrimary = val)} />
                  </div>
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
                  if (attachedLink != "") {
                    setIsLoading(true)
                    const res = await fetchAddLinkEmbedding({ link: attachedLink, ...dataRef.current })
                    setIsLoading(false)
                    if (res) {
                      setIsModalOpen(false)
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
