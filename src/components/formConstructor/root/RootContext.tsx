"use client"
import { useGetRegistrationFormQuery } from "@/api/registration/clientApiInterface"
import Loading from "@/app/loading"
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react"
import { DateRange } from "react-day-picker"

export type availableFields = "dropdown" | "text" | "number" | "date" | "file" | "geolocation" | "player" | "coach" | "problems_checkboxes"

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

export type PlayerInputProperties = {
  fieldType: "player"
}

export type CoachInputProperties = {
  fieldType: "coach"
}

export type ProblemsCheckboxesInputProperties = {
  fieldType: "problems_checkboxes"
}

export type FieldProperties = 
  | DropdownProperties
  | TextInputProperties
  | NumberInputProperties
  | DateInputProperties
  | FileInputProperties
  | GeolocationInputProperties
  | PlayerInputProperties
  | CoachInputProperties
  | ProblemsCheckboxesInputProperties

export type Field = {
  id: number
  fieldName: string
  properties: FieldProperties
  optional: boolean
}

type ConstructorRootContextType = {
  fields: Field[]
  addField: (fieldName: string, id: number) => void
  setFields: (fields: Field[]) => void
  setFieldType: (type: availableFields, id: number) => void
  setProperties: (properties: FieldProperties, id: number) => void
  changeName: (name: string, id: number) => void
  setOptional: (optional: boolean, id: number) => void
  getFieldById: (id: number) => Field | null,
  removeField: (id: number) => void
  formType: string,
  tId: number,
  counter: RefObject<number>
}

const ConstructorRootContext = createContext<ConstructorRootContextType | null>(null)

export function ConstructorRootProvider({
  isEdit = false,
  isExpanded = false,
  children,
  formType,
  tournamentId
}: {
  isEdit?: boolean
  isExpanded?: boolean
  children: ReactNode
  formType: string
  tournamentId: number
}) {
  const {data, isLoading: isInformationLoading, isSuccess, isError} = useGetRegistrationFormQuery({id: tournamentId, type: formType})
  const [fields, setFields] = useState<Field[]>([])
  const [tId, ] = useState(tournamentId) 
  const counter = useRef(0)
  useEffect(()=>{
    if (isInformationLoading==false){
      
      if (isSuccess){
        const initFields = data?.fields?.map((field, idx)=>{
          return {
            id: idx,
            fieldName: field.title,
            properties: {
              fieldType: field.type,
              ...field.metadata
            },
            optional: field.metadata?.optional == "true"
          }
        }) ?? []
        counter.current = initFields.length
        console.log("initFields", initFields)
        //@ts-ignore
        setFields(initFields)
      }
      if(isError){
        setFields([])
      }
    }
  }, [isInformationLoading])

  const addField = (fieldName: string, id: number, optional: boolean = false) => {
    setFields((prev) => [
      ...prev,
      {
        fieldName: fieldName,
        properties: { fieldType: "text" },
        id,
        optional
      },
    ])
  }

  const removeField = (id: number) => {
    setFields((prev) => [
      ...prev.filter((field) => field.id !== id)
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

  const setOptional =  (optional: boolean, id: number)=> {
    setFields((prev) =>
      prev.map((val) => {
        if (val.id !== id) return val
        else
          return {
            ...val,
            optional: optional,
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
      value={{ getFieldById, fields, addField, setFields, setFieldType, setProperties, changeName, formType, tId, counter, setOptional, removeField}}
    >

      {!isInformationLoading && children}
      {isInformationLoading && <Loading/>}
    </ConstructorRootContext>
  )
}

export function useConstructorRoot() {
  const ctx = useContext(ConstructorRootContext)

  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return { ...ctx }
}
