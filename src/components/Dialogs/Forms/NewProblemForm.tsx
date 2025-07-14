import {StaticDropdown} from "@/components/ui/Dropdown";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";
import BlueButton from "@/components/Default/BlueButton";

function NewProblemForm({setModalState, setNewProblemData}: {
  setModalState: (state: number) => void,
  setNewProblemData: (state: NewProblemFormData) => void
}) {
  const newProblemData: NewProblemFormData = {
    tournamentType: 1,
    year: 2025,
    globalNumber: 1,
    firstTranslationName: "",
    firstTranslationText: "",
    firstTranslationBy: ""
  }
  return (
    <div>
      <BlueButton onClick={() => setModalState(0)}>Назад</BlueButton>
      <div>
        <h1>Добавить новую задачу</h1>
        <p>Тип турнира</p>
        <StaticDropdown
          options={availableTournamentTypes.map((tt) => {
            return {displayName: tt.toUpperCase(), value: tt, active: true};
          })}
          defaultSelection={0}
          onOptionSelect={function (selection: string): void {
            newProblemData.tournamentType = availableTournamentTypes.indexOf(selection) + 1
          }}></StaticDropdown>

        <p>Сезон задачи</p>
        <input type={"number"}
               onChange={(event) => {
                 newProblemData.year = Number(event.target.value)
               }
          } defaultValue={2025}/>

        <p>Номер задачи в списке</p>
        <input type={"number"}
               onChange={(event) => {
                 newProblemData.globalNumber = Number(event.target.value)
               }}
               defaultValue={1} min={1}/>

        <p>Название задачи в официальном переводе</p>
        <input type={"text"}
               onChange={(event) => {
                 newProblemData.firstTranslationName = event.target.value
               }}
        />

        <p>Условие в официальном переводе</p>
        <textarea
               onChange={(event) => {
                 newProblemData.firstTranslationText = event.target.value
               }}
        />

        <p>Название официального перевода</p>
        <input type={"text"}
               onChange={(event) => {
                 newProblemData.firstTranslationBy = event.target.value
               }}
        />

      </div>
      <BlueButton onClick={() => {
        setModalState(2)
        setNewProblemData(newProblemData)
      }
      }>Добавить</BlueButton>
    </div>

  )
}

export default NewProblemForm;