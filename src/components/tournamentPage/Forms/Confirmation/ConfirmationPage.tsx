"use client"
import { usePersonalDataRequestsQuery } from "@/api/auth/clientApiInterface"
import Loading from "@/app/loading"
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"


export default function ConfirmationPage(
    {tournamentId}: { tournamentId: number}
){
  // Сначала ищется заявка с этим пользователем (сделать эндпоинт)
  // Эта заявка отображается.
  // Далее галочки, которые летят со специального эндпоинта и кнопка подтвердить заявку. ready
  const token = useAppSelector(store => store.auth.token)
  const {data: personalDataRequests, isLoading} = usePersonalDataRequestsQuery({token: token, tournamentId: tournamentId})
  
  return (
    <>
      <div>
        <p>
          Здесь отображаем заявку
        </p>
        {isLoading && <Loading/>}
        {!isLoading && (
          <>
            {personalDataRequests?.map((item) => {
              switch (item.type.typeFlag) {
                case "personal_2":
                  return <RegisterRequest key={item.requestId}/>
              }

            })}
          </>
        )}
      </div>
    </>
  )
}