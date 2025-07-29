'use client'
import footerStyle from "@/styles/app/footer.module.css";
import {useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";


export default function LogoWithTT({logoSize, margin}: {logoSize: string, margin: string}) {
  const tt = useAppSelector(state=>state.searchParams.tt)
  return (
    <div>
      <h2 className={footerStyle.mainBioHeaderText} style={{fontSize:logoSize}}>МТИ</h2>
      <p className={footerStyle.ttBioHeaderText}  style={{fontSize:logoSize, marginTop: margin}}>{tt?.slice(0, -1)}<span style={{color: availableTournamentTypes.find(type=>type.name===tt)?.color}}>{tt?.slice(-1)}</span></p>
      {/*TODO Сделать корректное отображение типа турнира*/}
    </div>
  )
}