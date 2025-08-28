import headerStyle from "@/styles/components/sections/app/header.module.css"
import Link from "next/link"
import TournamentTypeSelector from "@/components/Redux/TournamentTypeSelector"
import {FaMoon} from "react-icons/fa"
import ProfilePicture from "@/components/main/Profile"
import {Button} from "@/components/ui/Buttons"
import {FiMenu} from "react-icons/fi"
import {FaBell} from "react-icons/fa"
import ThemeSwitchingButton from "../Redux/ThemeSwitcher"
import {FILES_SERVER} from "@/constants/APIEndpoints"

export default function Header() {
  return (
    <>
      <header className="flex justify-between px-10 py-3 bg-bg-alt transition">
        <div className="flex gap-1 items-center h-fit font-bold">
          <Link href={"/"} className="flex items-center h-fit">
            <div className="size-[4rem] bg-text-main  mask-[url('https://api.mtiyt.ru/files/get/LogoType.svg')] mask-no-repeat mask-center mask-contain"></div>
          </Link>
          <div className="flex flex-col text-text-main  text-3xl items-center justify-center align-center">
            <Link href={"/"} className="w-full">
              <h1 className=" w-full text-start pl-2">МТИ</h1>
            </Link>
            <TournamentTypeSelector className=""/>
          </div>
        </div>
        <div className="flex flex-row items-center text-text-main gap-[1vw]">
          <ThemeSwitchingButton className="rounded-full border-2"/>
          <Button className="rounded-full border-2 h-16 aspect-square">
            <ProfilePicture className=""/>
          </Button>
        </div>
      </header>
    </>
  )
}
