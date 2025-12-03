"use client";
import CheckboxGroupRegistrationField
  from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxGroupRegistrationField";
import {useGetProblemsQuery} from "@/api/problems/clientApiInterface";
import Loading from "@/app/loading";

export default function CheckboxesWithProblems({key, title, ttype, year}: {key: string, title: string, year: number, ttype: string}) {
  const {data, isLoading} = useGetProblemsQuery({tournament: ttype, year: year})
  const fieldsProps = data?.map((item) => {
    return {
      key: `${item.id}`,
      title: item.problem_translations[0].problem_name,
      name: item.id.toString(),
      value: item.id.toString()
    }
  }) ?? []
  return (
    <>
      {isLoading && <Loading/>}
      {!isLoading && <CheckboxGroupRegistrationField group={{
        key: key,
        title: title,
        fields: fieldsProps,
      }}/>}
    </>
  )
}