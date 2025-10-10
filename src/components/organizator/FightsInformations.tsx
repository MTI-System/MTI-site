import { useCallback, useContext, useEffect, useState } from "react"
import { Input, Popover } from "@base-ui-components/react"
import AppendableInfoContainer, { AppendableInfoContext } from "../ui/AppendableInfoContainer"
import { TournamentCardCallback } from "@/app/(main)/organizators/create/page"
import DatePicker, { formatDate } from "../pickers/DatePicker"

type ContainerInterface = {
  title: string
  date_timestamp: number
}

export default function FightsInformations({ update }: { update: TournamentCardCallback }) {
  const [fightContainers, setFightContainers] = useState<ContainerInterface[]>([])
  return (
    <>
      <div className="flex h-fit justify-between">
        <h2 className="text-xl font-medium">Конструктор информации о боях</h2>
        <Popover.Root>
          <Popover.Trigger className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
            <div className="aspect-square h-full">?</div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align={"end"}>
              <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                <Popover.Title className="text-base font-medium">
                  Добавьте список боев, которые будут играться на турнире!
                </Popover.Title>
                <Popover.Description className="text-base text-gray-600">
                  Каждый добавленный пунки - это один отборочный бой или финал.
                  <br />
                  Пример списка:
                  <ol className="ms-5 list-disc">
                    <li>Первый отборочный бой</li>
                    <li>Второй отборочный бой</li>
                    <li>Финал</li>
                  </ol>
                </Popover.Description>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
      {fightContainers.map((container, index) => (
        <AppendableInfoContainer
          key={container.title+container.date_timestamp}
          prevInfoInitial={container}
          onInfoChange={(info) => {
            setFightContainers((prev) => {
              const newInfo = prev.map((_, i) =>
                i === index ? { title: info.title, date_timestamp: info.date_timestamp } : _,
              )
              update({ fight_containers: newInfo as ContainerInterface[] })
              return newInfo
            })
          }}
          onRemove={() => {
            setFightContainers((prev) => {
              const newInfo = prev.filter((_, i) => i !== index)
              update({ fight_containers: newInfo as ContainerInterface[] })
              return newInfo
            })
          }}
          className="flex flex-row justify-between"
          btnDivClassName="flex flex-row justify-between"
          btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
        >
          <InputRow />
        </AppendableInfoContainer>
      ))}
      <AppendableInfoContainer
        key={fightContainers.length+"new"}
        onInfoChange={(info) => {
          setFightContainers((prev) => {
            const new_value = [...prev, { title: info.title, date_timestamp: info.date_timestamp }]
            update({ fight_containers: new_value as ContainerInterface[] })
            return new_value
          })
        }}
        className="flex flex-row justify-between"
        btnDivClassName="flex flex-row justify-between"
        btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
      >
        <InputRow />
      </AppendableInfoContainer>
    </>
  )
}

function InputRow() {
  const { info, setAppendableInfo, isEditable } = useContext(AppendableInfoContext)
  const [initialValue, setInitialValue] = useState(info.title)
  useEffect(() => {
    !isEditable && setInitialValue(info.title)
  }, [isEditable])
  return (
    <div className="flex flex-row justify-between">
      {isEditable ? (
        <Input
          className="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
          defaultValue={initialValue}
          placeholder="Название боя"
          onChange={(e) => {
            setAppendableInfo({ ...info, title: e.target.value })
          }}
        />
      ) : (
        <p>{info.title}</p>
      )}
      {isEditable?(<DatePicker
        type="single"
        onPick={(date) => {
          setAppendableInfo({ ...info, date_timestamp: date.getTime() })
        }}
      />) :(
        <div className="flex items-center gap-2">
            <span className="text-[0.8rem]">{formatDate(info.date_timestamp)}</span>
        </div>
      )}
    </div>
  )
}
