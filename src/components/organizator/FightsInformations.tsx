import { useCallback, useContext, useEffect, useState } from "react"
import { Input, Popover, Tooltip } from "@base-ui-components/react"
import AppendableInfoContainer, { AppendableInfoContext } from "../ui/AppendableInfoContainer"
import { TournamentCardCallback } from "@/app/(main)/organizators/create/page"
import DatePicker, { formatDate } from "../pickers/DatePicker"
import twclsx from "@/utils/twClassMerge"

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
          key={container.title + container.date_timestamp}
          prevInfoInitial={container}
          onInfoChange={(info) => {
            const errs = []
            if (!info.title) errs.push({ key: "title", message: "Название боя не введено" })
            if (!info.date_timestamp) errs.push({ key: "date_timestamp", message: "Дата боя не выбрана" })
            if (errs.length > 0) return errs
            setFightContainers((prev) => {
              const newInfo = prev.map((_, i) =>
                i === index ? { title: info.title, date_timestamp: info.date_timestamp } : _,
              )
              update({ fight_containers: newInfo as ContainerInterface[] })
              return newInfo
            })
            return []
          }}
          onRemove={() => {
            setFightContainers((prev) => {
              const newInfo = prev.filter((_, i) => i !== index)
              update({ fight_containers: newInfo as ContainerInterface[] })
              return newInfo
            })
            return undefined
          }}
          className="flex flex-row justify-between"
          btnDivClassName="flex flex-row justify-between"
          btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
        >
          <InputRow />
        </AppendableInfoContainer>
      ))}
      {fightContainers.length > 0 && <div className="my-2 w-full border-2 border-b border-gray-300"></div>}
      <AppendableInfoContainer
        key={fightContainers.length + "new"}
        onInfoChange={(info) => {
          const errs = []
          if (!info.title) errs.push({ key: "title", message: "Название боя не введено" })
          if (!info.date_timestamp) errs.push({ key: "date_timestamp", message: "Дата боя не выбрана" })
          if (errs.length > 0) return errs
          setFightContainers((prev) => {
            const new_value = [...prev, { title: info.title, date_timestamp: info.date_timestamp }]
            update({ fight_containers: new_value as ContainerInterface[] })
            return new_value
          })
          return []
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
  const { info, setAppendableInfo, isEditable, error } = useContext(AppendableInfoContext)
  const [initialValue, setInitialValue] = useState(info.title)
  useEffect(() => {
    !isEditable && setInitialValue(info.title)
  }, [isEditable])
  const titleErrors = error.filter((err) => err.key === "title")
  const dateErrors = error.filter((err) => err.key === "date_timestamp")
  console.log(titleErrors, dateErrors)
  return (
    <div className="flex flex-row justify-between">
      <Tooltip.Provider delay={150}>
        {isEditable ? (
          <Tooltip.Root disabled={titleErrors.length === 0}>
            <Tooltip.Trigger>
              <Input
                className={twclsx("border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border", titleErrors.length > 0 && "border-red-500")}
                defaultValue={initialValue ? initialValue : ""}
                placeholder="Название боя"
                onChange={(e) => {
                  setAppendableInfo({ ...info, title: e.target.value })
                }}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={10}>
                <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                  <p className="text-red-500">{titleErrors.length > 0 ? titleErrors[0].message : ""}</p>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ) : (
          <p>{info.title}</p>
        )}
        {isEditable ? (
          <Tooltip.Root disabled={dateErrors.length === 0}>
            <Tooltip.Trigger render={<div className={twclsx(dateErrors.length > 0 && "text-red-500")}></div>}>
              <DatePicker
                type="single"
                onPick={(date) => {
                  console.log(date)
                  setAppendableInfo({ ...info, date_timestamp: date.getTime() })
                }}
                defaultDate={info.date_timestamp}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={10}>
                <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                  <p className="text-red-500">{dateErrors.length > 0 ? dateErrors[0].message : ""}</p>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ) : (
          <span className="text-[0.8rem]">
            {info.date_timestamp ? formatDate(info.date_timestamp) : <p>Дата не выбрана</p>}
          </span>
        )}
      </Tooltip.Provider>
    </div>
  )
}
