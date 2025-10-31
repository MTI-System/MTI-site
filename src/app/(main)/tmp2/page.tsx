"use client"
import { Forms } from "@/components/forms"

export default function SecondTmp() {
  return (
    <>
      <Forms.Root isEdit={true} isExpanded={false}>
        <Forms.EdiatableItems>
          <Forms.InputField placeholder={"Введите rrr"} onVerification={(value: string) => {
            if (value !== "rrr"){
              return {
                  isSuccess: false,
                  errorMessage: "Нужно написать rrr !!!!!"
              };
            }
            return {
                isSuccess: true,

            }
          }}/>
          <Forms.InputField placeholder={"Введите rrr"} onVerification={(value: string)=>{
            if (value !== "rrr"){
              return {
                  isSuccess: false,
                  errorMessage: "прям очень надо написать rrr !!!!!"
              };
            }
            return {
                isSuccess: true,

            }
          }}/>
          <Forms.InputField placeholder={"Введите rrr"} onVerification={(value: string)=>{
            if (value !== "rrr"){
              return {
                  isSuccess: false,
                  errorMessage: "только rrr и больше ничего !!!!!"
              };
            }
            return {
                isSuccess: true,

            }
          }}/>
        </Forms.EdiatableItems>
        <Forms.DefaultItems>
          asd
        </Forms.DefaultItems>
        <Forms.ConfirmButton onClick={()=>{}}/>
      </Forms.Root>
    </>
  )
}
