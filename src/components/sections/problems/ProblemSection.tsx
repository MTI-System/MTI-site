import {ProblemSection} from "@/types/problemAPI"
import style from "@/styles/problems/problemSection.module.css"
import Image from "next/image";
import {FILES_SERVER} from "@/constants/APIEndpoints";

export default function ProblemSectionComponent({section}: { section: ProblemSection }) {
  return (
    <div className={style.sectionCard} style={{backgroundColor: section.tile_color}}>
      <img className={style.icon} src={FILES_SERVER + section.icon_src}/>
      <p>{section.title}</p>
    </div>
  )
}