"use client"
import {TournamentRegistrationFormInfoInterface} from "@/types/TournamentRegistrationApi";
import {Forms} from "@/components/forms";
import LineRegistrationField from "./Parts/LineRegistrationField";
import DateRegistrationField from "./Parts/DateRegistrationField";
import DropdownRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DropdownRegistrationField";
import PersonPicker from "@/components/pickers/PersonPicker";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import PickPersonRegistrationField from "./Parts/PickPersonRegistrationField";
import { DayPicker } from "react-day-picker";



export default function TournamentRegistrationForm({
                                                     formInfo,
                                                     className,
                                                     isEdit,
                                                   }: {
  formInfo: TournamentRegistrationFormInfoInterface | null
  className: string,
  isEdit: boolean
}) {
  console.log("Getted form: ", formInfo)
  return (
    <>
      <h1>Регистрация на турнир</h1>

     <Forms.Root isEdit={true} isExpanded={false}>
        <Forms.Trigger className="mt-4 flex flex-col gap-2" onConfirm={(e) => {
          console.log("form result", e.entries().toArray());
        }}>

            {formInfo?.fields.map((field)=>{
              switch (field.type){
                case "number":
                case "text":
                  return <LineRegistrationField key={field.id}  field={{
                    id: 0,
                    formField: field,
                    content: "Ответ"
                  }}/>
                case "date":
                  return <DateRegistrationField key={field.id} field={field}/>
                case "dropdown":
                  return <DropdownRegistrationField key={field.id} field={field}/>
                case "player":
                  return <PickPersonRegistrationField key={field.id} field={field}/>
                default:
                  return <p>Unknown</p>
              }
            }
            )
          }
          <Forms.ConfirmButton className="bg-accent-primary/30 h-10 rounded-xl px-10 border-accent-primary border hover:bg-accent-primary/50 text-accent-primary font-bold">
            Отправить форму
          </Forms.ConfirmButton>
        </Forms.Trigger>
      </Forms.Root>
    </>
  )

}
