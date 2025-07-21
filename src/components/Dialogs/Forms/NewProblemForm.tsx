import {StaticDropdown} from "@/components/ui/Dropdown"
import {availableTournamentTypes} from "@/constants/AvailableTournaments"
import {Button} from "@/components/ui/Buttons"
import {fetchAddSectionToTask} from "@/scripts/ApiFetchers";

function NewProblemForm({
                          setModalState,
                          problemId
                        }: {
  setModalState: (state: number) => void,
  problemId: number
}) {
  const newProblemData: { newSection: string } = {
    newSection: "4"
  }
  return (
    <div>
      <Button onClick={() => setModalState(0)}>Назад</Button>
      <div>
        <h1>Добавить новый тип задачи</h1>
        <p>Тип турнира</p>
        <StaticDropdown
          options={
            [{displayName: "Механика", value: '4', active: true},
              {displayName: "Оптика", value: '5', active: true},
            {displayName: "Термодинамика", value: '6', active: true},
            {displayName: "Магнетизм", value: '7', active: true}]
          }
          defaultSelection={0}
          onOptionSelect={function (selection: string): void {
            newProblemData.newSection = selection
          }}
        ></StaticDropdown>

        <Button onClick={()=>{
          setModalState(0);
          (async ()=>{
            await fetchAddSectionToTask(problemId.toString(), newProblemData.newSection)
          })()
        }}>Добавить</Button>
      </div>
    </div>
  )
}

export default NewProblemForm
