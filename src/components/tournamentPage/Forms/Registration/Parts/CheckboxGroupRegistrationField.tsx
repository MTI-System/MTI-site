"use client"

import { Forms } from "@/components/forms"

interface CheckBoxGroupProps{
    fields: CheckBoxProps[],
    title: string
}

interface CheckBoxProps{
    name: string,
    value: string,
    title: string
}

export default function CheckboxGroupRegistrationField(
    { group }: { group: CheckBoxGroupProps }
){


    return (
        <>
        {group.title}
        <Forms.EdiatableItems>
            {
                group.fields.map((checkbox)=>(
                    <>
                        <label className="flex justify-start items-center gap-2 text-base text-gray-900">
                            <Forms.CheckboxField
                                value={checkbox.value}
                                onVerification={() => {
                                return {
                                    isSuccess: true,
                                }
                                }}
                                name={checkbox.value}
                            />
                            {checkbox.title}
                        </label>
                    </>
                    
                ))
                

            }
            
            
        </Forms.EdiatableItems>
        <Forms.DefaultItems>
            <h1>Future</h1>
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
        </>

    )
}