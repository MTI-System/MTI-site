import { Constructor } from "@/components/formConstructor"
import { Accordion } from "@base-ui-components/react"
import JurySwitch from "./JurySwitch"

export default async function ConstructorTournamentRegistrationFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: number }>
  searchParams: Promise<{ jury: string }>
}) {
  const id = (await params).id
  const isJury = (await searchParams).jury === "true"
  return (
    <>
      <Constructor.Root formType={isJury ? "jury" : "registration"} tournamentId={id}>
        <Accordion.Root className="text-text-main flex w-full max-w-[calc(100vw-8rem)] flex-col justify-center">
          <Accordion.Item className="border-border overflow-hidden rounded-2xl border">
            <Accordion.Header>
              <Accordion.Trigger className="group bg-bg-alt hover:bg-hover relative flex w-full items-baseline justify-between gap-4 py-2 pr-1 pl-3 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                Как пользоваться конструктором форм?
                <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="text-text-main h-[var(--accordion-panel-height)] overflow-hidden text-base transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
              <div className="p-3">
                <p>Форма состоит из блоков элементов. В данный момент в конструкторе доступны следующие блоки:</p>
                <ul className="ml-6 list-disc">
                  <li>
                    <h3>Текст</h3>
                    <p>Любая текстовая информация (например, для названия команды)</p>
                  </li>
                  <li>
                    <h3>Число</h3>
                    <p>Поле для ввода числа</p>
                  </li>
                  <li>
                    <h3>Участник</h3>
                    <p>
                      Поле для выбора участника в команду. Заполняющий руководитель выбирает участников из списка
                      зарегистрированных на платформе людей
                    </p>
                  </li>
                  <li>
                    <h3>Поле для ввода руководителя</h3>
                    <p>
                      Данное поле необязательно. Человек, который заполняет форму - руководитель по умолчанию. Данное
                      поле добавлять только в случае, если нужно указать дополнительных руководителей.
                    </p>
                  </li>
                  <li>
                    <h3>Чекбоксы со списком задач текущего года</h3>
                    <p>Если для регистрации турнира команда должна указать список решенных задач</p>
                  </li>
                </ul>
                <p>
                  Информация о человеке, который заполняет форму вам придёт автоматически. Например, если вы делаете
                  форму регистрации для жюри, то его ФИО, возраст и почта будут доступны, для этого не нужно добавлять
                  поля
                </p>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
        <JurySwitch isJury={isJury} />
        <Constructor.Layout />
      </Constructor.Root>
    </>
  )
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  )
}
