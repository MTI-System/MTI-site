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
            [{displayName: "Механика", value: '1', active: true},
              {displayName: "Оптика", value: '2', active: true},
            {displayName: "Термодинамика", value: '3', active: true},
            {displayName: "Магнетизм", value: '4', active: true}]
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
