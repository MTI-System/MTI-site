"use client"
import {TournamentRegistrationFormInfoInterface} from "@/types/TournamentRegistrationApi";
import {Forms} from "@/components/forms";

export default function TournamentRegistrationForm({
                                                     formInfo,
                                                     className,
                                                      isEdit,
                                                   }: {
  formInfo: TournamentRegistrationFormInfoInterface | null
  className: string,
  isEdit: boolean
}) {


  return (
    <>
      <Forms.Root isEdit={isEdit} isExpanded={false}>
        <Forms.Trigger onConfirm={(e) => {
          console.log("form result", e.entries().toArray());
        }}>
          <Forms.EdiatableItems>
            {formInfo?.fields.map((field)=>{
              switch (field.type){
                case "text":
                  return <Forms.InputField name={field.key} placeholder={field.title} onVerification={(value: string) => {
                    if (value !== "rrr") {
                      return {
                        isSuccess: false,
                        errorMessage: "Нужно написать rrr !!!!!"
                      };
                    }
                    return {
                      isSuccess: true,

                    }
                  }}/>
                default:
                  return <p>Unknown field</p>
              }
            })}

            {/*<Forms.DatePickerField name={"date1"} type={"single"} onVerification={(value) => {*/}
            {/*  if(value === "01.11.2025") {*/}
            {/*    return {*/}
            {/*      isSuccess: true,*/}
            {/*    }*/}
            {/*  }*/}
            {/*  return {*/}
            {/*    isSuccess: false,*/}
            {/*    errorMessage: "Выберите дату 01.11.2025"*/}
            {/*  }*/}
            {/*}}/>*/}




            <Forms.ConfirmButton onClick={() => {
              return {
                isSuccess: false,
              }
            }}/>
          </Forms.EdiatableItems>
          <Forms.DefaultItems>
            asd
          </Forms.DefaultItems>

        </Forms.Trigger>
      </Forms.Root>
    </>
  )
}