import {User} from "@/types/authApi";

function Menu({profileData}: { profileData: User }){
  return (
    <p>{profileData.username}</p>
  )
}

export default Menu;