"use client"

import { useFormsInformationQuery, useGetAnswersQuery } from "@/api/registration/clientApiInterface"
import Loading from "@/app/loading"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import TournamentRegistrationForm from "../Registration/TournamentRegistrationForm"
import { Accordion } from "@base-ui-components/react"
import {useGetTournamentCardQuery} from "@/api/tournaments/clientApiInterface";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import ApplicationsList from "@/components/tournamentPage/Forms/Registration/ApplicationsList";

export default function ApplicationsPage(
    {id}: {id: number}
){
    const {data, isLoading} = useFormsInformationQuery({
        id: id
    })
    const formId = data?.availableForms?.find(f=>f.formTypeFlag==="registration")?.formId
    const token = useAppSelector(state=>state.auth.token)
    const {data: answers, isLoading: isAnswersLoading} = useGetAnswersQuery({
        token: token,
        id: formId ?? 0
    }, {skip: formId===undefined})
    console.log("answers: ", answers, formId, isAnswersLoading)
    return (
        <>
            {isAnswersLoading && <Loading/>}
            {answers ? (
              <>
                <ApplicationsList answers={answers} tournamentId={id}/>
              </>  
            ): <p>Нет заявок для формы {formId} {JSON.stringify(data)}</p>}
        </>
    )
}

