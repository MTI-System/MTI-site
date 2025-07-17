import {User} from "@/types/authApi";
import mainStyle from "@/styles/app/mainPage.module.css";
import ClickableCard from "@/components/ui/ClickableCard";
import LockedClickableCard from "@/components/ui/LockedClickableCard";

function OrganizationMenu({profileData}: { profileData: User }){
  const right_flags = profileData.rights.map(it=>it.right_flag)
  return (
    <div className={mainStyle.cardGrid}>
      {/*{checkPermissions(right_flags, ["ADD_PROBLEMS", "ADD_PROBLEM_MATERIALS", "DELETE_PROBLEMS"]) &&*/}
      {/*(*/}
      {/*  <ClickableCard href={"/organization/problems"}>*/}
      {/*    Задачи*/}
      {/*  </ClickableCard>*/}
      {/*) ||*/}
      {/*  (*/}
      {/*  <LockedClickableCard href={""}>*/}
      {/*    Задачи*/}
      {/*  </LockedClickableCard>*/}
      {/*  )}*/}
    </div>
  )
}

function checkPermissions(right_flags: string[], needed: string[]){
  let i;
  for (i in right_flags){
    if (i in needed){
      return true
    }
  }
  return false
}

export default OrganizationMenu;