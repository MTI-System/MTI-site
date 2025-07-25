import headerStyle from "@/styles/app/header.module.css";
import Link from "next/link";
import TournamentTypeSelector from "@/components/sections/app/TournamentTypeSelector";
import GlobalSearch from "@/components/sections/app/SearchBar";
import {FaMoon} from "react-icons/fa";
import iconStyle from "@/styles/icons.module.css";
import ProfilePicture from "@/components/sections/app/Profile";
import {Button} from "@/components/ui/Buttons";
import {FILES_SERVER} from "@/constants/APIEndpoints";
import {FiMenu} from "react-icons/fi";
import {FaBell} from "react-icons/fa";

export default function Header() {
  return (
    <>
      <header className={headerStyle.header}>
        <div className={headerStyle.leftContainer}>
          <Button className={headerStyle.headerRoundButton}>
            <FiMenu className={headerStyle.headerIconInButton}/>
          </Button>
          <div>
            <Link href={"/"}>
              <h1>МТИ</h1>
              <TournamentTypeSelector className={headerStyle.dropdown}/>
            </Link>
          </div>
        </div>
        <div className={headerStyle.rightContainer}>
          {/*<GlobalSearch/>*/}
          <Button className={headerStyle.headerRoundButton}>
            <FaMoon className={headerStyle.headerIconInButton}/>
          </Button>
          <Button className={headerStyle.headerRoundButton}>
            <FaBell className={headerStyle.headerIconInButton}/>
          </Button>
          <Button className={headerStyle.headerRoundButton}>
            <ProfilePicture className={headerStyle.headerIconInButton}/>
          </Button>
        </div>
      </header>
    </>
  )
}