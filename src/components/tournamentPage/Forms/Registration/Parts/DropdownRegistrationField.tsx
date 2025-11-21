import { Forms } from "@/components/forms";
import { TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi";

export default function DropdownRegistrationField(
  {field}: {field: TournamentRegistrationFormFieldInterface}
){

  return (
    <>
      <Forms.EdiatableItems>
        {
          <Forms.DropdownField key={field.id} name="drop_multi" onVerification={()=>{
            return {
              isSuccess: true
            }
          }} type="single"/>
        }
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        <p >Дропдаун заполненный</p>
      </Forms.DefaultItems>
    </>
  )
}