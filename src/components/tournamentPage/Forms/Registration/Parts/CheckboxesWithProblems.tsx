"use client";
import CheckboxGroupRegistrationField
  from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxGroupRegistrationField";
import {useGetProblemsQuery} from "@/api/problems/clientApiInterface";
import Loading from "@/app/loading";
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface
} from "@/types/TournamentRegistrationApi";

export default function CheckboxesWithProblems({ttype, year, field}: {field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface, year: number, ttype: string}) {
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent = "formField" in field ? field.content : ""
  const checkedFields = fieldContent.split(",")

  const {data, isLoading} = useGetProblemsQuery({tournament: ttype, year: year})
  const fieldsProps = data?.map((item) => {
    return {
      key: `${item.id}`,
      title: item.problem_translations[0].problem_name,
      name: item.id.toString(),
      value: item.id.toString(),
      isChecked: fieldContent.includes(item.id.toString()),
    }
  }) ?? []
  return (
    <>
      {isLoading && <Loading/>}
      {!isLoading &&
          <CheckboxGroupRegistrationField group={{
            key: fieldObject.key,
            title: fieldObject.title,
            fields: fieldsProps
          }}/>}
    </>
  )
}