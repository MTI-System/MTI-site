"use client"
import {Forms} from "@/components/forms"
import {Form} from "@base-ui-components/react";
import {useEffect, useRef, useState} from "react";
import {useCardsRoot} from "@/components/forms/root/RootContext";

interface CheckBoxGroupProps {
  fields: CheckBoxProps[],
  title: string,
  key: string
}

interface CheckBoxProps {
  name: string,
  value: string,
  title: string
  isChecked: boolean
}

export default function CheckboxGroupRegistrationField(
  {group}: { group: CheckBoxGroupProps }
) {
  const { register, setFormField } = useCardsRoot()
  const fields = useRef<Set<string>>(new Set())
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)

  useEffect(() => {
    register(() => {
      const result = {
        isSuccess: true
      }
      // onVerification(inputRef.current?.value || "")
      console.log("aaa", result, fields.current)
      setVerificationResult(result)
      if (result.isSuccess) {
        setFormField(group.key, fields.current.keys().toArray().toString())
      }
      return result
    })
  }, [])

  return (
    <div className={"border p-2 border-border rounded-lg"}>
      <h4 className="font-bold pb-2">{group.title}</h4>
      <Forms.EdiatableItems>
          {group.fields.map((checkbox) => (
            <div key={checkbox.value}>
              <label className="flex justify-start items-center gap-2 text-base text-gray-900">
                <Forms.CheckboxField
                  title={checkbox.title}
                  value={checkbox.value}
                  // defaultChecked={checkbox}
                  is_grouped={true}
                  onChange={(value, is_checked)=>{
                    if (is_checked) {
                      fields.current.add(value)
                    }
                    else {
                      fields.current.delete(value)
                    }
                  }}
                  onVerification={() => {
                    return {
                      isSuccess: true,
                    }
                  }}
                  name={checkbox.value}
                />
              </label>
            </div>

          ))}
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {group.fields.map((checkbox) => (
          <div key={checkbox.value}>
            <label className="flex justify-start items-center gap-2 text-base text-gray-900">
              <Forms.CheckboxField
                defaultChecked={checkbox.isChecked}
                title={checkbox.title}
                value={checkbox.value}
                is_grouped={true}
                disabled={true}

                onChange={(value, is_checked)=>{
                  if (is_checked) {
                    fields.current.add(value)
                  }
                  else {
                    fields.current.delete(value)
                  }
                }}
                onVerification={() => {
                  return {
                    isSuccess: true,
                  }
                }}
                name={checkbox.value}
              />
            </label>
          </div>

        ))}
        {/* {fieldContent && (
            <>
                <div className="border-border bg-bg-main-accent h-15 w-full rounded-md border px-2">
                <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
                <p className="text-text-main px-2 pt-2 font-bold">{fieldContent}</p>
                TODO: Make default items for checkbox
                </div>
             </>
            )}
            {!fieldContent && <p>Ошибка!</p>} */}
      </Forms.DefaultItems>
    </div>

  )
}