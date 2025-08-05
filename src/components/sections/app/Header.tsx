import headerStyle from "@/styles/components/sections/app/header.module.css"
import Link from "next/link"
import TournamentTypeSelector from "@/components/sections/app/TournamentTypeSelector"
import { FaMoon } from "react-icons/fa"
import ProfilePicture from "@/components/sections/app/Profile"
import { Button } from "@/components/ui/Buttons"
import { FiMenu } from "react-icons/fi"
import { FaBell } from "react-icons/fa"
import ThemeSwitchingButton from "./ThemeSwitcher"
import { FILES_SERVER } from "@/constants/APIEndpoints"

export default function Header() {
  return (
    <>
      <header className={headerStyle.header}>
        <div className={headerStyle.leftContainer}>
          <Link href={"/"}>
            <div className={headerStyle.logo}></div>
          </Link>
          <div>
            <Link href={"/"}>
              <h1 style={{ justifySelf: "start" }}>МТИ</h1>
            </Link>
            <TournamentTypeSelector className={headerStyle.dropdown} />
          </div>
        </div>
        <div className={headerStyle.rightContainer}>
          <ThemeSwitchingButton className={headerStyle.headerRoundButton} />
          <Button className={headerStyle.headerRoundButton}>
            <FaBell className={headerStyle.headerIconInButton} />
          </Button>
          <Button className={headerStyle.headerRoundButton}>
            <ProfilePicture className={headerStyle.headerIconInButton} />
          </Button>
        </div>
      </header>
    </>
  )
}
