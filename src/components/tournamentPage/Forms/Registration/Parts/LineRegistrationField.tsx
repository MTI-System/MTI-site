import { Forms } from "@/components/forms";
import { TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi";

export default function LineRegistrationField(
    {field}: {field: TournamentRegistrationFormFieldInterface}
){

    return (
        <>
          <Forms.EdiatableItems>
            {
                <Forms.InputField 
                className="w-full h-10 px-2 rounded-md border border-border bg-bg-main-accent"
                type={field.type} 
                name={field.key} 
                placeholder={field.title} 
                onVerification={(value: string) => {
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
            }
          </Forms.EdiatableItems>
          <Forms.DefaultItems>
            <p >Объект заполненный</p>
          </Forms.DefaultItems>
        </>
    )
}