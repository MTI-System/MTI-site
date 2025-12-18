"use client"
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import { useGetFightInformationQuery } from "@/api/tournaments/clientApiInterface";
import { FightTable } from "./FightTable";
import { UserAvatarWithTitleByID } from "../ui/Avatars";

export default function FightList(){
    return(
         //<div className="flex flex-col gap-5">
        <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main">Раздел боев</h1>
            <div className="flex flex-wrap justify-center gap-5">
                <UsersProviderWrapper>
                    <FightCard CardID={1}/>
                    <FightCard CardID={2}/>
                    <FightCard CardID={3}/>
                </UsersProviderWrapper>
            </div>
        </div>
    )
}

export function FightCard({CardID}:{CardID : number}) {
  const {data: fightData, isLoading, error, isSuccess } = useGetFightInformationQuery({ fightId: CardID })
  if(!isLoading){
  return (
    <>
      <a href="" className='max-w-full'>
        <div className="border bg-bg-alt border-border rounded-2xl py-4 px-7 mx-auto">

          <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase">room</h2>

            <div className='overflow-x-auto border-b border-border '>
              <FightTable teams={fightData?.teams || []}/>
            </div>

          <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase mt-5">jury</h2>

            <div className='  
            grid 
            grid-cols-2
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5 
            2xl:grid-cols-6
            gap-4
            '>
                <UserAvatarWithTitleByID PeoplesIDs={fightData?.jouries}/>
            </div>

        </div>
      </a>
    </>
  )
}
}