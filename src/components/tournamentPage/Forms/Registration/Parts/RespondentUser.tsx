
import {useGetUserByIdQuery} from "@/api/users/clientApiInterface";
import {Forms} from "@/components/forms";
import Loading from "@/app/loading";

export default function RespondentUser({userId}: {
  userId: number
}) {
  const {data: user, isLoading} = useGetUserByIdQuery({id: +(userId)})
  return (
    <>
      <Forms.EdiatableItems>
        <></>
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {isLoading && <Loading/>}
        {!isLoading && (
          <div className="border-border bg-bg-main-accent h-15 w-full rounded-md border px-2">
            <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">Руководитель</p>
            <p className="text-text-main px-2 pt-2 font-bold">{user?.firstName} {user?.secondName} {user?.thirdName}</p>
          </div>
        )}
      </Forms.DefaultItems>
    </>
  )
}
