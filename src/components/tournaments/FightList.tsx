"use client"
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import { useGetFightInformationQuery } from "@/api/tournaments/clientApiInterface";
import { FightTable } from "./FightTable";
import { UserAvatarWithTitleByID } from "../ui/Avatars";
import { FightInfoByTournamentInterface, FightInformationInterface } from "@/types/TournamentsAPI";
import Link from "next/link";


export default function FightList({fightData}:{fightData: FightInformationInterface}) {
    return (
        <div className="flex flex-col items-center px-4">
            <h1 className="font-bold mx-auto text-2xl text-center mb-8 text-text-main">Раздел боев</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full">
                {fightData.map((item)  =>(
                    itemArr.map(=>(
                        <FightCard key={item.id} cardData={item} />
                    )
                    )
                ))}
            </div>
        </div>
    )
}

export function FightCard({ cardData }: { cardData: FightInformationInterface}) {
    if (cardData.teams.length>0) {
        return (
            <>
                <div className="border max-w-full min-w-175 bg-bg-alt border-border rounded-2xl py-4 px-7">

                    <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase">room</h2>

                    <Link href={'./' + cardData.id} className='border-b border-border mb-4 md:mb-5 pb-4'>
                        <div className="overflow-x-auto">
                        <FightTable teams={cardData?.teams} />
                        </div>
                    </Link>

                    <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase mt-5">jury</h2>

                    <div className='flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-8'>
                        <UsersProviderWrapper>
                            <UserAvatarWithTitleByID PeoplesIDs={cardData?.jouries} />
                        </UsersProviderWrapper>
                    </div>

                </div>
            </>
        )
    }else{
    return (
        <>
            <div className="border max-w-full bg-bg-alt border-border rounded-2xl py-4 px-7">

                <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase text-">пока тут ничего нет</h2>

            </div>
        </>
    )
}
}
// }

//     return (
//         <div className="border bg-bg-alt border-border rounded-2xl p-4 md:p-6 w-full overflow-hidden">
//             <h2 className="font-bold text-xl md:text-2xl text-center mb-4 md:mb-5 text-text-main uppercase">room</h2>

//             <div className='border-b border-border mb-4 md:mb-5 pb-4'>
//                 <div className="overflow-x-auto">
//                     <FightTable teams={fightData?.teams || []} />
//                 </div>
//             </div>

//             <h2 className="font-bold text-xl md:text-2xl text-center mb-4 md:mb-5 text-text-main uppercase">jury</h2>

//             <div className='flex flex-wrap justify-center gap-3 md:gap-4'>
//                 <UserAvatarWithTitleByID PeoplesIDs={fightData?.jouries} />
//             </div>
//         </div>
//     )
// }