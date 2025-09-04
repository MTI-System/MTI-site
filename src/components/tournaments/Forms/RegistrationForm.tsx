"use client"
import {
  TournamentRegistrationFormFieldInterface,
  TournamentRegistrationFormInfoInterface
} from "@/types/TournamentRegistrationApi";
import TextFormField from "@/components/tournaments/Forms/TextFormField";
import {createConsoleError} from "next/dist/next-devtools/shared/console-error";
import {FormEvent, useRef} from "react";
import {Button} from "@/components/ui/Buttons";
import {sendFormAnswer} from "@/scripts/ApiFetchers";

export default function RegistrationForm(
  {formInfo, className}: {formInfo: TournamentRegistrationFormInfoInterface, className: string}
){
  const formReference = useRef(null)
   const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSend(event.currentTarget)
  }

  async function handleSend(form: HTMLFormElement) {
    const formData = new FormData(form);
    formData.set("tournament_id", formInfo.tournament.toString())
    console.log("form", formData, form, formData.get("field1"))
    await sendFormAnswer(formData)
  }

  return (
    <>
      <form className={className} onSubmit={submitHandler} ref={formReference}>
        {formInfo.fields.map((field) => {
          switch (field.type) {
            case 'text':
              return <TextFormField title={field.title} key={field.id} id_key={field.key}/>
          }
        })}
        <Button className="rounded-full bg-accent-primary px-20 py-5 text-text-on-accent hover:opacity-70" type="submit">Отправить</Button>
      </form>
    </>
  )
}