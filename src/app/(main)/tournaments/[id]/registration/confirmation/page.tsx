"use client"
import Loading from "@/app/loading";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {usePersonalDataRequestsQuery} from "@/api/auth/clientApiInterface";
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest";

export default function ConfirmationPage(props: {}) {
  // Сначала ищется заявка с этим пользователем (сделать эндпоинт)
  // Эта заявка отображается.
  // Далее галочки, которые летят со специального эндпоинта и кнопка подтвердить заявку. ready
  const token = useAppSelector(store => store.auth.token)
  const {data, isLoading} = usePersonalDataRequestsQuery({token: token})
  return (
    <>


      <div>
        <p>
          Здесь отображаем заявку
        </p>
        {isLoading && <Loading/>}
        {!isLoading && (
          <>
            {data?.map((item) => {
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