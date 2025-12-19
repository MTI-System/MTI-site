"use client"
import { useGetUserByIdQuery } from "@/api/users/clientApiInterface";
import twclsx from "@/utils/twClassMerge";
import { Avatar } from "@base-ui-components/react";


const Cell = ({juryID, changeAvatar, changeTextUnderAvatar}:{juryID: number, changeAvatar?:string, changeTextUnderAvatar?:string}) => {
        const { data: userData, isLoading: userIsLoading} = useGetUserByIdQuery({ id: juryID })
        return(
        <div className= {twclsx('flex flex-col text-text-main text-center text-wrap justify-center items-center', changeTextUnderAvatar)}>
          <Avatar.Root className= {twclsx("uppercase inline-flex size-12 sm:size-12 mb-2 items-center justify-center overflow-hidden rounded-full bg-hover align-middle text-base font-medium text-text-main select-none", changeAvatar)}>
          
          {userData ? userData.firstName[0] : ''}
          
          </Avatar.Root>
          
          {userData? (
            <>
            {(userData.auth===null)?<p>{userData.secondName} {userData.firstName}. {userData.thirdName}.</p>:<p>{userData.secondName} {userData.firstName} {userData.thirdName}</p>}
          
          </>) : (<>
           <p className="animate-pulse flex h-6 w-60 m-1 bg-hover rounded "></p>
           </>)}  
              
        </div>
      )
    };


export function UserAvatarWithTitleByID(
  {PeoplesIDs, changeclassNameAvatar, changeclassNameTextUnderAvatar}:{PeoplesIDs: number[]|undefined, changeclassNameAvatar?: string, changeclassNameTextUnderAvatar?: string}) {
  return (
    <>
    {PeoplesIDs?.map((id) => (
        <Cell key={id} juryID={id} changeAvatar={changeclassNameAvatar} changeTextUnderAvatar={changeclassNameTextUnderAvatar}/>
    ))}
    </>
  )
}
