import Link from "next/link"
import TournamentTypeSelector from "@/components/Redux/TournamentTypeSelector"
import ProfilePicture from "@/components/main/Profile"
import { Button } from "@/components/ui/Buttons"
import ThemeSwitchingButton from "../Redux/ThemeSwitcher"
import NotificationsButton from "@/components/notifications/NotificationsButton"
import { cookies } from "next/headers"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { makeAuthStoreServer } from "@/api/auth/serverStore"

export default async function Header() {
  const initTT = (await cookies()).get("mtiyt_tournamentType")?.value ?? "1"
  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}))
  const { data: tournamentTypes } = await promise

  return (
    <>
      <header className="bg-bg-alt flex justify-between px-5 py-3 transition">
        <div className="flex h-fit items-center gap-1 font-bold">
          <Link href={"/"} className="flex h-fit items-center">
            <div className="bg-text-main size-16 mask-[url('https://api.mtiyt.ru/files/get/LogoType.svg')] mask-contain mask-center mask-no-repeat"></div>
          </Link>
          <div className="text-text-main align-center flex flex-col items-center justify-center text-3xl">
            <Link href={"/"} className="w-full">
              <h1 className="w-full pl-2 text-start">МТИ</h1>
            </Link>
            <TournamentTypeSelector
              initTournamentType={Number(initTT)}
              availableTournamentTypes={tournamentTypes ?? []}
            />
          </div>
        </div>
        <div className="text-text-main flex flex-row items-center gap-[1vw]">
          <NotificationsButton />
          <ThemeSwitchingButton className="rounded-full border-2" />
          <Button className="aspect-square h-16 rounded-full border-2">
            <ProfilePicture className="" />
          </Button>
        </div>
      </header>
    </>
  )
}
