import {Forms} from "@/components/forms";
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface
} from "@/types/TournamentRegistrationApi";



export default function LineRegistrationField(
  {field}: {
    field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface;
  }
) {
  const fieldObject = ("formField" in field) ? field.formField : field;
  const fieldContent =  ("formField" in field) ? field.content : undefined;
  return (
    <>
      <Forms.EdiatableItems>
        {
          <div className="relative w-full h-15 rounded-md border border-border bg-bg-main-accent">
            <p className="h-4 pt-1 px-2 absolute text-[13px] text-text-alt">{fieldObject.title}</p>
            <Forms.InputField
              className="size-full px-2 pt-4 h-full leading-[2.75rem] placeholder:text-text-main font-bold"
              type={fieldObject.type}
              name={fieldObject.key}
              placeholder={fieldObject.title}
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
          </div>

        }
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {fieldContent && (
          <>
            <div className="w-full h-15 px-2 rounded-md border border-border bg-bg-main-accent">
              <p className="h-4 pt-1 px-2 text-[13px] text-text-alt">{fieldObject.title}</p>
              <p className="px-2 pt-2 text-text-main font-bold">{fieldContent}</p>
            </div>
          </>
        )}
        {!fieldContent && <p>Ошибка!</p>}
      </Forms.DefaultItems>
    </>
  )
}