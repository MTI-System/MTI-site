import {Forms} from "@/components/forms"
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface
} from "@/types/TournamentRegistrationApi"
import {useGetUserByIdQuery} from "@/api/users/clientApiInterface";
import Loading from "@/app/loading";
import {formatDate} from "@/components/pickers/DatePicker";

export default function PickPersonRegistrationField({field}: {
  field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface
}) {
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent = "formField" in field ? field.content : undefined
  const {data: user, isLoading} = useGetUserByIdQuery({id: +(fieldContent??0)}, {skip: fieldContent===undefined})
  return (
    <>
      <Forms.EdiatableItems>
        {
          <Forms.UserPickerField
            key={fieldObject.id}
            name={fieldObject.key}
            title={fieldObject.title}
            onVerification={() => {
              return {
                isSuccess: true,
              }
            }}
          />
        }
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {isLoading && <Loading/>}
        {!isLoading && (
          <div className="border-border bg-bg-main-accent h-fit w-full min-h-15 rounded-md border px-2">
            <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
            <p className="text-text-main px-2 pt-2 font-bold">{user?.firstName} {user?.secondName} {user?.thirdName}</p>
            {user?.birthday && <p  className="text-text-alt px-2 font-bold">{"Дата рождения: " + formatDate(new Date(user?.birthday ?? 0))}</p>}
            {user?.email && <p  className="text-text-alt px-2 pb-2 font-bold">{"email: " + user?.email}</p>}
          </div>
        )}
      </Forms.DefaultItems>
    </>
  )
}
