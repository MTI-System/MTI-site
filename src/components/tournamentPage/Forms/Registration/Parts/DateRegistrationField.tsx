import { Forms } from "@/components/forms";
import { TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi";

export default function DateRegistrationField(
    {field}: {field: TournamentRegistrationFormFieldInterface}
){

    return (
        <>
          <Forms.EdiatableItems>
            {
                <Forms.DatePickerField 
                className="w-full h-10 px-2 rounded-md border border-border bg-bg-main-accent flex justify-between items-center"
                name={field.key} 
                type={"single"}
                onVerification={(value: string) => {
                    return {
                    isSuccess: true,
                    }
                }}/>
            }
          </Forms.EdiatableItems>
          <Forms.DefaultItems>
            <p >Объект заполненный</p>
          </Forms.DefaultItems>
        </>
    )
}