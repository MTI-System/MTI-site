"use client"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import {
  useGetActionInformationQuery,
  useGetFightInfoByTournamentQuery,
  useGetFightInformationQuery,
  useGetTeamInTournamentQuery,
} from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import { useGetUserByAuthIdQuery, useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { FightInformationInterface, TeamInTournamentInterface } from "@/types/TournamentsAPI"
import { Avatar, Button, Combobox, Form } from "@base-ui-components/react"
import { useEffect, useId, useState } from "react"
import { Provider } from "react-redux"
import { User } from '@/types/UsersApi';
import twclsx from "@/utils/twClassMerge"

export function Page({mainData} :  {mainData : TeamInTournamentInterface}) {

  

  return (

    <div className=" ">
      <div className=" ">

       
        <CommandCell mainData={mainData}/>

      

    {/* <Button className="me-5 flex h-5 w-35  mt-6  shrink-0 items-center justify-center rounded-full border-3 transition-colors md:h-7 md:min-w-fit md:border border-[#3849FF] bg-[#3849FF]/20 text-[#3849FF]">
      На глобальную
    </Button> */}
    </div>

      <hr className="w-full border-t border-border " />

      <UsersProviderWrapper>
    <div className="flex flex-wrap justify-center items-center gap-4 p-6">

      {/* {mainData.players.map((player, index) => <Card id = {player} key = {index}/>)} */}

      <UserAvatarWithTitleByID PeoplesIDs={mainData.players} changeclassNameAvatar='inline-flex items-center  justify-center overflow-hidden rounded-full size-28 sm:size-28 text-xl'
        changeclassNameTextUnderAvatar='text-xl p-7 '/>
      
      {/* <Card />
      <Card />
      <Card />
      <Card />
      <Card /> */}
      
      
       
       
    </div>  
    </UsersProviderWrapper>

       

    {/* <TournamentsProviderWrapper>
      <QueryTest />
    </TournamentsProviderWrapper> */}

    </div>

  )
}

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


function CommandCell( {mainData} :  {mainData : TeamInTournamentInterface} ){

  return(
    <div className="flex flex-wrap items-center justify-around flex-col  gap-2  p-10 font-bold">
      <CommandMainAvatar CommandName={mainData.name}/>
      <h1 className=" flex text-text-main  gap-2 flex-col pt-7 text-4xl">{mainData.name}</h1>
    </div>
  )
}


function CommandMainAvatar({CommandName}:{CommandName:string}) {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Avatar.Root className="uppercase inline-flex size-35 sm:size-35 mb-2 items-center justify-center overflow-hidden rounded-full bg-hover align-middle text-base font-medium text-text-main select-none">
        <Avatar.Image
          
          width="48"
          height="48"
          className="size-full object-cover"
        />
        <Avatar.Fallback className="flex size-full items-center justify-center text-base text-xl">
          {CommandName[0]}
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
























// function Card( {id} : {id : number}){
// const {data, isLoading, isError} = useGetUserByIdQuery({id: id})
//   return(
//     <div className=" p-7">
//       <div className="flex justify-center w-full mt-9"> 
//         <MainAvatar />
//       </div>
      
//       <h1 className="text-center pt-7 text-text-main  text-2xl">{data?.firstName} {data?.secondName}</h1>
//       {/* <h1 className="text-center p-2 text-text-main  text-2xl"></h1> */}
//       <h1 className="text-center mb-3 text-text-main  text-2xl">{data?.thirdName}</h1>
//       {/* <>{JSON.stringify(data)}</> */}
//     </div>
//   )
// }

// function QueryTest() {
//   const { data, isLoading, error, isSuccess } = useGetFightInformationQuery({ fightId: 1 })
//   const {
//     data: actionData,
//     isLoading: actionLoading,
//     error: actionError,
//     isSuccess: actionSuccess,
//   } = useGetActionInformationQuery({ actionId: 1 })
//   const {
//     data: teamData,
//     isLoading: teamLoading,
//     error: teamError,
//     isSuccess: teamSuccess,
//   } = useGetTeamInTournamentQuery({ teamId: 1 })

//   return (
//     <div className="flex flex-col gap-2">
//       <p className="text-sm text-gray-500">Fight Information</p>
//       <p>{JSON.stringify(data)}</p>
//       <p className="text-sm text-gray-500">Action Information</p>
//       <p>{JSON.stringify(actionData)}</p>
//       <p className="text-sm text-gray-500">Team Information</p>
//       <p>{JSON.stringify(teamData)}</p>
      
//     </div>
//   )
// }