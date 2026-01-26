import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { FightTable } from "./FightTable"
import { UserAvatarWithTitleByID } from "../ui/Avatars"
import { FightContainerInfoInterface, FightInformationInterface } from "@/types/TournamentsAPI"
import Link from "next/link"
import { FaExternalLinkAlt } from "react-icons/fa"

export default function FightList({ fightsData }: { fightsData: FightContainerInfoInterface }) {
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-text-main mx-auto mb-8 text-center text-2xl font-bold">Раздел боев</h1>
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        {fightsData.map((item, idx) => (
          <FightCard key={item.id} cardData={item} tmpIDX={idx} />
        ))}
      </div>
    </div>
  )
}

export function FightCard({ cardData, tmpIDX }: { cardData: FightInformationInterface; tmpIDX: number }) {
  // --------------DELETE LATER-------------
  const roomNames = ["A", "B", "C"]
  // ---------------------------------------
  if ((cardData.teams?.length ?? 0) > 0) {
    return (
      <>
        <div className="bg-bg-alt border-border max-w-full rounded-2xl border px-7 py-4">
          {/*<Link href={"./fight/" + cardData.id}>*/}
          {/*  <h2 className="text-text-main mx-auto mb-5 text-center text-2xl font-bold uppercase">room</h2>*/}
          {/*</Link>*/}

          <div className="flex w-full flex-col content-center items-center justify-center gap-2 pb-5">
            <Link href={"./fight/" + cardData.id}>
              <h2 className="text-text-main hover:text-text-main/80 mx-auto flex flex-row items-center justify-center gap-3 text-center text-2xl font-bold uppercase transition-colors">
                Комната {roomNames[tmpIDX]}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 630 512"
                  className="text-main"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,
                  16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,
                  112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,
                  320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24
                  ,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,
                  4.5,41-17V24A24,24,0,0,0,488,0Z"
                  />
                </svg>
              </h2>
            </Link>
            {cardData.is_location_link || (
              // <a
              //   className="text-text-alt hover:text-text-alt/80 flex flex-row content-center items-center justify-center gap-2 transition-colors"
              //   target="_blank"
              //   href={cardData.location}
              // >
              //   Конференция <FaExternalLinkAlt className="text-sm" />
              // </a>
              <p
                className="text-text-alt hover:text-text-alt/80 flex flex-row content-center items-center justify-center gap-2 transition-colors"

              >
                {cardData.location}
              </p>
            )}
          </div>

          {cardData?.teams && (
            <div className="border-border mb-4 border-b pb-4 md:mb-5">
              <div className="overflow-x-auto">
                <FightTable teams={cardData?.teams} />
              </div>
            </div>
          )}

          <h2 className="text-text-main mx-auto mt-5 mb-5 text-center text-2xl font-bold uppercase">jury</h2>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-8">
            <UsersProviderWrapper>
              <UserAvatarWithTitleByID PeoplesIDs={cardData?.jouries} />
            </UsersProviderWrapper>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        {/* <div className="border max-w-full bg-bg-alt border-border rounded-2xl py-4 px-7">

                <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase text-">пока тут ничего нет</h2>

            </div> */}
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
