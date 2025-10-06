"use client"
import {
  TournamentRegistrationFormFieldInterface,
  TournamentRegistrationFormInfoInterface
} from "@/types/TournamentRegistrationApi";
import TextFormField from "@/components/tournamentPage/Forms/TextFormField";
import {createConsoleError} from "next/dist/next-devtools/shared/console-error";
import {FormEvent, useRef} from "react";
import {Button} from "@/components/ui/Buttons";
import {sendFormAnswer} from "@/scripts/ApiFetchers";

export default function RegistrationForm(
  {formInfo, className}: {formInfo: TournamentRegistrationFormInfoInterface | null, className: string}
){
  const formReference = useRef(null)
   const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSend(event.currentTarget)
  }

  async function handleSend(form: HTMLFormElement) {
    const formData = new FormData(form);
    formData.set("formId", (formInfo?.id ?? 0).toString());
    await sendFormAnswer(formData)
  }

  return (
    <>
      <form className={className} onSubmit={submitHandler} ref={formReference}>
        {formInfo?.fields.map((field) => {
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