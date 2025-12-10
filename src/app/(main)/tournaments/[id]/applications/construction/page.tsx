import {Constructor} from "@/components/formConstructor";
import { Accordion } from "@base-ui-components/react";

export default async function ConstructorTournamentRegistrationFormPage(
  { params }: { params: Promise<{ id: number }> }
){  
    const id = (await params).id
    return (
      <>
        <Constructor.Root formType={"registration"} tournamentId={id}>
          <Accordion.Root className="flex w-full max-w-[calc(100vw-8rem)] flex-col justify-center text-text-main">

            <Accordion.Item className="border rounded-2xl  border-border overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="group relative flex w-full items-baseline justify-between gap-4 bg-bg-alt py-2 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                  Как пользоваться конструктором форм?
                  <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-text-main transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                <div className="p-3">
                  <p>Форма состоит из блоков элементов. В данный момент в конструкторе доступны следующие блоки:</p>
                  <ul className="list-disc ml-6">
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
                      <p>Поле для выбора участника в команду. Заполняющий руководитель выбирает участников из списка зарегистрированных на платформе людей</p>
                    </li>
                    <li>
                      <h3>Поле для ввода руководителя</h3>
                      <p>Данное поле необязательно. Человек, который заполняет форму - руководитель по умолчанию. Данное поле добавлять только в случае, если нужно указать дополнительных руководителей.</p>
                    </li>
                    <li>
                      <h3>Чекбоксы со списком задач текущего года</h3>
                      <p>Если для регистрации турнира команда должна указать список решенных задач</p>
                    </li>
                  </ul>

                </div>
              </Accordion.Panel>
            </Accordion.Item>


          </Accordion.Root>
          <Constructor.Layout/>
        </Constructor.Root>
      </>
    )
}


function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}