import { StaticDropdown } from "@/components/ui/Dropdown"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import Button from "@/components/ui/Button"

function NewProblemForm({
  setModalState,
  setNewProblemData,
  currentTournamentType,
  currentYear,
}: {
  setModalState: (state: number) => void
  setNewProblemData: (state: NewProblemFormData) => void
  currentTournamentType: number
  currentYear: number
}) {
  const newProblemData: NewProblemFormData = {
    tournamentType: currentTournamentType,
    year: currentYear,
    globalNumber: 1,
    firstTranslationName: "",
    firstTranslationText: "",
    firstTranslationBy: "",
  }
  return (
    <div>
      <Button onClick={() => setModalState(0)}>Назад</Button>
      <div>
        <h1>Добавить новую задачу</h1>
        <p>Тип турнира</p>
        <StaticDropdown
          options={availableTournamentTypes.map((tt) => {
            return { displayName: tt.name.toUpperCase(), value: tt.name, active: true }
          })}
          defaultSelection={availableTournamentTypes.findIndex((val) => val.id === currentTournamentType)}
          onOptionSelect={function (selection: string): void {
            newProblemData.tournamentType = availableTournamentTypes.find((val) => val.name === selection)?.id ?? 0
          }}
        ></StaticDropdown>

        <p>Сезон задачи</p>
        <input
          type={"number"}
          onChange={(event) => {
            newProblemData.year = Number(event.target.value)
          }}
          defaultValue={currentYear}
        />

        <p>Номер задачи в списке</p>
        <input
          type={"number"}
          onChange={(event) => {
            newProblemData.globalNumber = Number(event.target.value)
          }}
          defaultValue={1}
          min={1}
        />

        <p>Название задачи в официальном переводе</p>
        <input
          type={"text"}
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
        <input
          type={"text"}
          onChange={(event) => {
            newProblemData.firstTranslationBy = event.target.value
          }}
          defaultValue={"Официальный перевод"}
        />
      </div>
      <Button
        onClick={() => {
          setModalState(2)
          setNewProblemData(newProblemData)
        }}
      >
        Добавить
      </Button>
    </div>
  )
}

export default NewProblemForm
