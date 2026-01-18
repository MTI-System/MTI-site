"use client"
import {Forms} from "@/components/forms"
import AddFileField from "@/components/materials/AddFileField";
import {useState} from "react";
import {FileInputProperties} from "@/components/formConstructor/root/RootContext";
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface
} from "@/types/TournamentRegistrationApi";
import {formatDate} from "@/components/pickers/DatePicker";
import {FileInputField} from "@/components/forms/fields/FileInputField";
import UniversalEmbedding from "@/components/materials/UniversalEmbedding";
import MaterialsProviderWrapper from "@/api/materials/ClientWrapper";
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper";
import {FILES_SERVER} from "@/constants/APIEndpoints";

export default function FileRegistrationField({field}:
                                              {
                                                field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface
                                              }) {
  const [loadedFile, setLoadedFile] = useState("")
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent =
    "formField" in field ? field.content : undefined

  return (
    <>
      <Forms.EdiatableItems>
        {
          <div className="border-border bg-bg-main-accent relative h-15 w-full rounded-md border">
            <p className="text-text-alt absolute h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
            <Forms.FileInputField
              id={fieldObject.key}
              onVerification={(value: string) => {
                if (!value) {
                  return {
                    isSuccess: false,
                    errorMessage: "Файл не выбран"
                  }
                }
                return {
                  isSuccess: true
                }
              }}
              className="placeholder:text-text-main size-full h-full px-2 pt-4 leading-11 font-bold cursor-pointer"
              name={fieldObject.key} type="file"
              accept={fieldObject?.metadata?.accept ?? ""}/>
          </div>
        }
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        <div className="border-border bg-bg-main-accent relative h-15 w-full rounded-md border">
          <p className="text-text-alt absolute h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
          <a
            className="placeholder:text-text-main size-full h-full px-2 pt-4 leading-11 font-bold block cursor-pointer underline"
            href={FILES_SERVER + fieldContent}
            target="_blank"
          >{fieldContent}</a>
        </div>

      </Forms.DefaultItems>
    </>
  )
}