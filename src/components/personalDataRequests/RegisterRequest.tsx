"use client"

import {usePersonalDataRequestsQuery} from "@/api/auth/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import Loading from "@/app/loading";

export default function RegisterRequest() {

  return (
    <>

      <p>Галочка для подтверждения регистрационного разрешения</p>
    </>
  )
}