"use client"
import { Forms } from "@/components/forms"

export default function SecondTmp() {
  return (
    <>
      <Forms.Root isEdit={true} isExpanded={false}>
        <Forms.EdiatableItems>
          <Forms.InputField onVerification={()=>{
            console.log("Verification one");
            return true
          }}/>
          <Forms.InputField onVerification={()=>{
            console.log("Verification two");
            return true
          }}/>
          <Forms.InputField onVerification={()=>{
            console.log("Verification three");
            return true
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
