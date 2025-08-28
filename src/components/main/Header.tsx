import headerStyle from "@/styles/components/sections/app/header.module.css"
import Link from "next/link"
import TournamentTypeSelector from "@/components/Redux/TournamentTypeSelector"
import { FaMoon } from "react-icons/fa"
import ProfilePicture from "@/components/main/Profile"
import { Button } from "@/components/ui/Buttons"
import { FiMenu } from "react-icons/fi"
import { FaBell } from "react-icons/fa"
import ThemeSwitchingButton from "../Redux/ThemeSwitcher"
import { FILES_SERVER } from "@/constants/APIEndpoints"

export default function Header() {
  return (
    <>
      <header className="bg-bg-alt flex justify-between px-5 py-3 transition">
        <div className="flex h-fit items-center gap-1 font-bold">
          <Link href={"/"} className="flex h-fit items-center">
            <div className="bg-text-main size-[4rem] mask-[url('https://api.mtiyt.ru/files/get/LogoType.svg')] mask-contain mask-center mask-no-repeat"></div>
          </Link>
          <div className="text-text-main align-center flex flex-col items-center justify-center text-3xl">
            <Link href={"/"} className="w-full">
              <h1 className="w-full pl-2 text-start">МТИ</h1>
            </Link>
            <TournamentTypeSelector />
          </div>
        </div>
        <div className="text-text-main flex flex-row items-center gap-[1vw]">
          <ThemeSwitchingButton className="rounded-full border-2" />
          <Button className="aspect-square h-16 rounded-full border-2">
            <ProfilePicture className="" />
          </Button>
        </div>
      </header>
    </>
  )
}
