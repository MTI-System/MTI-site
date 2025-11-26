"use client"
import { Forms } from "@/components/forms";
import CheckboxGroupRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxGroupRegistrationField";
import CheckboxRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxRegistrationField";

export default function TempPage(){
    
    
    return (
        <>
            {/* <CheckboxRegistrationField field={{

            }}/> */}
{/*     
            <Forms.Root>
                <CheckboxGroupRegistrationField group={{
                    fields: [{
                        name: "aaa",
                        value: "bbb"
                    }],
                    title: "test"
                }}/>
            </Forms.Root> */}

        <Forms.Root isEdit={true} isExpanded={false}>
        <Forms.Trigger
          className="mt-4 flex flex-col gap-2"
          onConfirm={(e) => {
            console.log("form_result", e.entries().toArray())
          }}
        >
            <Forms.EdiatableItems>
                <CheckboxGroupRegistrationField group={{
                    fields: [{
                        name: "aaa",
                        value: "bbb",
                        title: "Галочка 1"
                    },
                    {
                        name: "aaaa",
                        value: "bbbb",
                         title: "Галочка 2"
                    },
                    {
                        name: "aaaaa",
                        value: "bbbbb",
                         title: "Галочка 3"
                    },
                    {
                        name: "aaaaaa",
                        value: "bbbbbb",
                         title: "Галочка 4"
                    }
                ],
                    title: "test"
                }}/>
            </Forms.EdiatableItems>
            <button type="submit">test</button>
        </Forms.Trigger>
      </Forms.Root>
        </>
    )
}