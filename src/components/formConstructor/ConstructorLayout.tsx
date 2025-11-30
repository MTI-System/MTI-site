"use client"
import { useConstructorRoot } from "@/components/formConstructor/root/RootContext"
import { Constructor } from "./index.parts"
import { useCallback, useEffect, useRef } from "react"
import { DragDropProvider } from "@dnd-kit/react"
import { move } from "@dnd-kit/helpers"
import { useCreateFormMutation, useFormsInformationQuery, useSetFieldsMutation } from "@/api/registration/clientApiInterface"
import Loading from "@/app/loading"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export function ConstructorLayout() {
  const { fields, addField, setFields, tId, formType, counter } = useConstructorRoot()
  const {data: formInformation, isLoading}= useFormsInformationQuery({id: tId})
  const [createForm, {isSuccess: isFormCreated, isLoading: isFormCreating}]=  useCreateFormMutation()
  const [saveFormChanges, {isSuccess: isFieldsUpdated, isLoading: isFieldsSetting}] = useSetFieldsMutation()
  const token = useAppSelector(state=>state.auth.token)
  // const counter = useRef<number>(0)



  const saveChanges = useCallback(()=>{
    saveFormChanges({newForm: {
      token: token,
      formId: tId,
      formType: formType,
      fields: fields.map(field=>({
        title: field.fieldName,
        type: field.properties.fieldType,
        metadata: 
          Object.entries(field.properties).map(
            (entrie) => 
              ({
                key: entrie[0],
                value: entrie[1]
              })
            
        ) ?? []
      }))
    }})
  }, [fields])

  useEffect(()=>{
    if (!isFormCreating && isFormCreated){
      saveChanges()
    }
  }, [isFormCreating])

  const onSubmit = ()=>{
    if (formInformation?.available_forms.find((it)=>it.form_type_flag === formType) === undefined){
      createForm({token: token, tournamentId: tId, formTypeFlag: formType, formTitle: "Форма регистрации"})
      return
    }
    saveChanges()
  }

  

  return (
    <>
      {isLoading && (
        <>
          <p>Загрузка информации о форме</p>
          <Loading/>
        </>
      )}
      {isFormCreating && (
        <>
          <p>Создание формы</p>
          <Loading/>
        </>
      )}
      {isFieldsSetting && (
        <>
          <p>Сохранение изменений</p>
          <Loading/>
        </>
      )}
      {(!isLoading && !isFormCreating && !isFieldsSetting) &&<div className="bg-bg-alt relative h-fit w-full pt-2">
        <DragDropProvider
          onDragEnd={(e) => {
            setFields(move(fields, e))
          }}
        >
          <ul>
            {fields.map((field, index) => (
              <Constructor.Item key={field.id} index={index} id={field.id} field={field} />
            ))}
          </ul>
        </DragDropProvider>
        <div className="flex gap-2">
          <button
            className={"bg-accent-primary/30 px-2 py-1 border border-accent-primary y rounded-md hover:bg-accent-primary/50"}
            onClick={() => {
              addField("Новое поле", counter.current)
              counter.current += 1
            }}
          >
            Добавить поле
          </button>
          <button
            className={"bg-accent-primary/30 px-2 py-1 border border-accent-primary y rounded-md hover:bg-accent-primary/50"}
            onClick={() => {
              console.log(fields)
              onSubmit()
            }}
          >
            Подтвердить изменение
          </button>
        </div>

      </div>}
    </>
  )
}
