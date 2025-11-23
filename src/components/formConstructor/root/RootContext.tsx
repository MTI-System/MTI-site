"use client"
import { createContext, ReactNode, useContext, useState } from "react"
import { DateRange } from "react-day-picker"

export type availableFields = "dropdown" | "text" | "number" | "date" | "file" | "geolocation"

export type DropdownOption = {
  label: string
  value: string
}

export type DropdownProperties = {
  fieldType: "dropdown"
  options?: DropdownOption[]
}

export type TextInputProperties = {
  fieldType: "text"
  placeholder?: string
}

// export type RadioSelectInputProperties = {
//   fieldType: "radio_select"
// }

export type NumberInputProperties = {
  fieldType: "number"
  minValue?: number
  maxValue?: number
}

export type DateInputProperties = {
  fieldType: "date"
  selectMode?: "single" | "range"
  selectableDateRanges?: DateRange[]
}

export type FileInputProperties = {
  fieldType: "file"
  accept?: string
}

export type GeolocationInputProperties = {
  fieldType: "geolocation"
}

export type FieldProperties =
  | DropdownProperties
  | TextInputProperties
  | NumberInputProperties
  | DateInputProperties
  | FileInputProperties
  | GeolocationInputProperties

export type Field = {
  id: number
  fieldName: string
  properties: FieldProperties
}

type ConstructorRootContextType = {
  fields: Field[]
  addField: (fieldName: string, id: number) => void
  setFields: (fields: Field[]) => void
  setFieldType: (type: availableFields, id: number) => void
  setProperties: (properties: FieldProperties, id: number) => void
  changeName: (name: string, id: number) => void
  getFieldById: (id: number) => Field | null
}

const ConstructorRootContext = createContext<ConstructorRootContextType | null>(null)

export function ConstructorRootProvider({
  isEdit = false,
  isExpanded = false,
  children,
}: {
  isEdit?: boolean
  isExpanded?: boolean
  children: ReactNode
}) {
  const [fields, setFields] = useState<Field[]>([])
  const addField = (fieldName: string, id: number) => {
    setFields((prev) => [
      ...prev,
      {
        fieldName: fieldName,
        properties: { fieldType: "text" },
        id,
      },
    ])
  }

  const setFieldType = (type: availableFields, id: number) => {
    setFields((prev) =>
      prev.map((val) => {
        if (val.id !== id) return val
        else
          return {
            ...val,
            properties: {
              fieldType: type,
            },
          }
      }),
    )
  }

  const setProperties = (properties: FieldProperties, id: number) => {
    console.log("get new props", properties, id)
    setFields((prev) =>
      prev.map((val) => {
        if (val.id !== id) return val
        else
          return {
            ...val,
            properties: properties,
          }
      }),
    )
  }

  const changeName = (name: string, id: number) => {
    setFields((prev) =>
      prev.map((val) => {
        if (val.id !== id) return val
        else
          return {
            ...val,
            fieldName: name,
          }
      }),
    )
  }

  const getFieldById = (id: number) => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].id === id) {
        return fields[i]
      }
    }
    return null
  }

  return (
    <ConstructorRootContext
      value={{ getFieldById, fields, addField, setFields, setFieldType, setProperties, changeName }}
    >
      {children}
    </ConstructorRootContext>
  )
}

export function useConstructorRoot() {
  const ctx = useContext(ConstructorRootContext)

  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return { ...ctx }
}
