"use client"

import { createContext, useState } from "react"
import { FaPlus } from "react-icons/fa6"

const AppendableInfoContext = createContext<{
  info: { [key: string]: any }
  setAppendableInfo: (appendableInfo: { [key: string]: any }) => void
  isEditable: boolean
}>({
  info: {},
  setAppendableInfo: () => {},
  isEditable: false,
})

interface AppendableInfoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  onInfoAppend: (info: { [key: string]: any }) => void
  onInfoChange: (info: { [key: string]: any }) => void
  onRemove: () => void
}
``
export default function AppendableInfoContainer({ children, onInfoAppend, onInfoChange, onRemove, ...props }: AppendableInfoContainerProps) {
  const [appendableInfo, setAppendableInfo] = useState<{ [key: string]: any }>({})
  const [isEditable, setIsEditable] = useState(false)
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
      <button
        className="mt-2 h-[2.5rem] w-[6rem] rounded-2xl border border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50"
        >
        <FaPlus />
      </button>
    </div>
  )
}
