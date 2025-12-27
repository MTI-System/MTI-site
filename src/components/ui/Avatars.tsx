"use client"
import { useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import twclsx from "@/utils/twClassMerge"
import { Avatar } from "@base-ui-components/react"

const Cell = ({
  juryID,
  changeAvatar,
  changeTextUnderAvatar,
}: {
  juryID: number
  changeAvatar?: string
  changeTextUnderAvatar?: string
}) => {
  const { data: userData, isLoading: userIsLoading, error: userErr } = useGetUserByIdQuery({ id: juryID })
  if (userIsLoading) {
    return <p className="bg-hover m-1 flex h-6 w-60 animate-pulse rounded"></p>
  }
  if (!userData) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-yellow-600">No user data found</h1>
      </div>
    )
  }
  return (
    <div
      className={twclsx(
        "text-text-main flex flex-col items-center justify-center text-center text-wrap",
        changeTextUnderAvatar,
      )}
    >
      <Avatar.Root
        className={twclsx(
          "bg-hover text-text-main mb-2 inline-flex size-12 items-center justify-center overflow-hidden rounded-full align-middle text-base font-medium uppercase select-none sm:size-12",
          changeAvatar,
        )}
      >
        {userData ? userData.firstName[0] : ""}
      </Avatar.Root>

      {userData.auth === null ? (
        <p>
          {userData.secondName} {userData.firstName}. {userData.thirdName ? userData.thirdName + "." : ""}
        </p>
      ) : (
        <p>
          {userData.secondName} {userData.firstName} {userData.thirdName}
        </p>
      )}
    </div>
  )
}

export function UserAvatarWithTitleByID({
  PeoplesIDs,
  changeclassNameAvatar,
  changeclassNameTextUnderAvatar,
  displaySpeakerRole,
}: {
  PeoplesIDs: number[] | undefined
  changeclassNameAvatar?: string
  changeclassNameTextUnderAvatar?: string
  displaySpeakerRole?: boolean
}) {
  return (
    <>
      {PeoplesIDs?.map((id, idx) => (
        <div key={id} className="flex h-fit w-fit flex-col content-center items-center justify-center gap-1">
          <Cell
            juryID={id}
            changeAvatar={changeclassNameAvatar}
            changeTextUnderAvatar={changeclassNameTextUnderAvatar}
          />
          {idx === 0 && displaySpeakerRole && (
            <p className="text-text-alt border-text-text-alt rounded-4xl border px-2 py-0.5 text-sm">Ведущий</p>
          )}
        </div>
      ))}
    </>
  )
}
