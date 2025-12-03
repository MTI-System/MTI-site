"use client"

import { createContext, useState } from "react"
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa6"
import { HoldButton } from "./Buttons"
import { FaEdit, FaTimes } from "react-icons/fa"
import twclsx from "@/utils/twClassMerge"

export interface EditError {
  key: string
  message: string
}

export const AppendableInfoContext = createContext<{
  info: { [key: string]: any }
  error: EditError[]
  setAppendableInfo: (appendableInfo: { [key: string]: any }) => void
  isEditable: boolean
}>({
  info: {},
  error: [],
  setAppendableInfo: () => {},
  isEditable: false,
})

interface AppendableInfoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onInfoChange?: (info: { [key: string]: any }) => EditError[]
  onRemove?: () => Omit<EditError, "key"> | undefined
  prevInfoInitial?: { [key: string]: any }
  btnDivClassName?: string
  btnClassName?: string
  editClassName?: string
  deleteClassName?:string
  confirmClassName?: string
  discardClassName?: string
  addClassName?: string
}

export default function AppendableInfoContainer({
  children,
  onInfoChange,
  onRemove,
  prevInfoInitial,
  btnDivClassName,
  btnClassName,
  editClassName,
  deleteClassName,
  confirmClassName,
  discardClassName,
  addClassName,
  ...props
}: AppendableInfoContainerProps) {
  const [prevInfo, setPrevInfo] = useState<{ [key: string]: any } | undefined>(prevInfoInitial)
  const [appendableInfo, setAppendableInfo] = useState<{ [key: string]: any }>(prevInfoInitial || {})
  const [error, setError] = useState<EditError[]>([])
  const [isEditable, setIsEditable] = useState(prevInfoInitial ? false : true)
  const handleEditDone = () => {
    const res = onInfoChange?.(appendableInfo)
    if (res && res.length > 0) {
      setError(res)
      return
    }

    setIsEditable(false)
    setPrevInfo(appendableInfo)
  }
  return (
    <div {...props}>
      <AppendableInfoContext
        value={{
          info: appendableInfo,
          error,
          setAppendableInfo: (info) => {
            setError((prev) => {
              const newError = prev.filter((err) => !(err.key in info))
              return newError
            })
            setAppendableInfo((prev) => ({ ...prev, ...info }))
          },
          isEditable: isEditable,
        }}
      >
        {children}
      </AppendableInfoContext>
      <div className={btnDivClassName}>
        {prevInfo && !isEditable && (
          <>
            <button
              className={twclsx(btnClassName, editClassName)}
              onClick={() => {
                setIsEditable(true)
              }}
            >
              <FaEdit />
            </button>
            <HoldButton
              className={twclsx(btnClassName, deleteClassName)}
              onConfirm={() => {
                if (onRemove) {
                  const res = onRemove()
                  if (!res) return
                  setError([{ key: "remove", ...res }])
                }
              }}
            >
              <FaMinus />
            </HoldButton>
          </>
        )}
        {prevInfo && isEditable && (
          <>
            <button
              className={twclsx(btnClassName, confirmClassName)}
              onClick={() => {
                handleEditDone()
              }}
            >
              <FaCheck />
            </button>
            <button
              className={twclsx(btnClassName, discardClassName)}
              onClick={() => {
                setIsEditable(false)
                setAppendableInfo(prevInfo)
              }}
            >
              <FaTimes />
            </button>
          </>
        )}
        {!prevInfo && (
          <button
            className={twclsx(btnClassName, addClassName)}
            onClick={() => {
              handleEditDone()
            }}
          >
            <FaPlus />
          </button>
        )}
      </div>
    </div>
  )
}

// function TmpInput() {
//   const { info, setAppendableInfo, isEditable } = useContext(AppendableInfoContext)
//   const [initialValue, setInitialValue] = useState(info.test)
//   useEffect(() => {
//     !isEditable && setInitialValue(info.test)
//   }, [isEditable])
//   return isEditable ? (
//     <input
//       defaultValue={initialValue}
//       onChange={(e) => setAppendableInfo({ ...info, test: e.target.value })}
//       className="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
//     />
//   ) : (
//     <p>{info.test}</p>
//   )
// }

// function Tmp() {
//   return (
//     <div>
//       <AppendableInfoContainer
//         onInfoChange={(i) => {
//           console.log("Info change", i)
//         }}
//         onRemove={() => {
//           console.log("Remove")
//         }}
//         btnDivClassName="flex flex-row justify-between"
//         className="flex w-full flex-row justify-between"
//         btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
//       >
//         <TmpInput />
//       </AppendableInfoContainer>
//     </div>
//   )
// }
