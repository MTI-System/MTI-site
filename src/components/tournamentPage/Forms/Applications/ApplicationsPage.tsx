"use client"

import { useFormsInformationQuery, useGetAnswersQuery } from "@/api/registration/clientApiInterface"
import Loading from "@/app/loading"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import TournamentRegistrationForm from "../Registration/TournamentRegistrationForm"

export default function ApplicationsPage(
    {id}: {id: number}
){
    const {data, isLoading} = useFormsInformationQuery({
        id: id
    })
    const formId = data?.available_forms.find(f=>f.form_type_flag==="registration")?.form_id
    const token = useAppSelector(state=>state.auth.token)
    const {data: answers, isLoading: isAnswersLoading} = useGetAnswersQuery({
        token: token,
        id: formId
    })


    return (
        <>
            {!formId && <Loading/>}

            {formId && (
              <>
                <TournamentRegistrationForm formInfo={answers} isEdit={false} className={""}/>
              </>  
            )}
        </>
    )
}