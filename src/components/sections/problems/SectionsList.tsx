"use client"
import style from "@/styles/problems/problemcard.module.css";
import ProblemSectionComponent from "@/components/sections/problems/ProblemSection";
import {Problem} from "@/types/problemAPI";
import {Button} from "@/components/ui/Buttons";
import ModalDialog from "@/components/Dialogs/ModalDialog";
import NewProblemForm from "@/components/Dialogs/Forms/NewProblemForm";
import {useState} from "react";

export default function SectionsList({problem, isModerator}: {problem: Problem, isModerator: boolean}) {
  const [modalDialogState, setDialogState] = useState(0)
  return (
    <div className={style.sectionsList}>
      {problem.problem_sections.map(section => {
        return <ProblemSectionComponent key={section.id} section={section}/>
      })}
      {problem.problem_sections.length == 0 && (
        <ProblemSectionComponent
          section={{id: 0, title: "Не определено", "icon_src": "forbidden.svg", tile_color: "#AAAAAA"}}/>
      )}
      {isModerator && <Button onClick={()=>setDialogState(1)}>Добавить</Button>}

      <ModalDialog isOpen={modalDialogState == 1} onClose={() => {}}>
          <NewProblemForm
            setModalState={setDialogState}
            problemId={problem.id}
          />
        </ModalDialog>
    </div>
  )
}