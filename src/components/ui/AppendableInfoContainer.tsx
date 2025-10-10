"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { FaCheck, FaCross, FaMinus, FaPlus } from "react-icons/fa6"
import { HoldButton } from "./Buttons"
import { FaEdit } from "react-icons/fa"

export const AppendableInfoContext = createContext<{
  info: { [key: string]: any }
  setAppendableInfo: (appendableInfo: { [key: string]: any }) => void
  isEditable: boolean
}>({
  info: {},
  setAppendableInfo: () => {},
  isEditable: false,
})

interface AppendableInfoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onInfoChange?: (info: { [key: string]: any }) => void
  onRemove?: () => void
  prevInfoInitial?: { [key: string]: any }
  btnDivClassName?: string
  btnClassName?: string
}

export default function AppendableInfoContainer({
  children,
  onInfoChange,
  onRemove,
  prevInfoInitial,
  btnDivClassName,
  btnClassName,
  ...props
}: AppendableInfoContainerProps) {
  const [prevInfo, setPrevInfo] = useState<{ [key: string]: any } | undefined>(prevInfoInitial)
  const [appendableInfo, setAppendableInfo] = useState<{ [key: string]: any }>(prevInfoInitial || {})
  const [isEditable, setIsEditable] = useState(prevInfoInitial ? false : true)
  const handleEditDone = () => {
    setIsEditable(false)
    onInfoChange?.(appendableInfo)
    setPrevInfo(appendableInfo)
  }
  return (
    <div {...props}>
      <AppendableInfoContext
        value={{
          info: appendableInfo,
          setAppendableInfo: (info) => {
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
              className={btnClassName}
              onClick={() => {
                setIsEditable(true)
              }}
            >
              <FaEdit />
            </button>
            <HoldButton
              className={btnClassName}
              onConfirm={onRemove}
            >
              <FaMinus />
            </HoldButton>
          </>
        )}
        {prevInfo && isEditable && (
          <>
            <button
              className={btnClassName}
              onClick={() => {
                handleEditDone()
              }}
            >
              <FaCheck />
            </button>
            <button
              className={btnClassName}
              onClick={() => {
                setIsEditable(false)
                setAppendableInfo(prevInfo)
              }}
            >
              <FaCross />
            </button>
          </>
        )}
        {!prevInfo && (
          <button
            className={btnClassName}
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
