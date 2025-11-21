import { DateInputProperties, useConstructorRoot } from "@/components/formConstructor/root/RootContext"
import DatePicker, { formatDate } from "@/components/pickers/DatePicker"
import AppendableInfoContainer, { AppendableInfoContext } from "@/components/ui/AppendableInfoContainer"
import { Select } from "@base-ui-components/react/select"
import { useContext, useState } from "react"
import { DateRange } from "react-day-picker"
import { FaCheck } from "react-icons/fa6"
import { RiExpandUpDownFill } from "react-icons/ri"

export default function DateFieldConstructor({ id }: { id: number }) {
  const { setProperties, getFieldById } = useConstructorRoot()
  const [selectableDateRanges, setSelectableDateRanges] = useState<DateRange[]>([])
  const currentProperties = getFieldById(id)?.properties as DateInputProperties
  const types: { label: string; value: "single" | "range" }[] = [
    { label: "даты", value: "single" },
    { label: "диапазона дат", value: "range" },
  ]
  return (
    <div>
      <div className="flex">
        <p>Производить выбор</p>

        <Select.Root
          multiple={false}
          items={types}
          defaultValue={"single"}
          onValueChange={(value) => {
            setProperties({ ...currentProperties, selectMode: value }, id)
          }}
        >
          <Select.Trigger className="flex h-full w-fit min-w-36 cursor-default items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:bg-gray-100">
            <Select.Value />
            <Select.Icon className="flex">
              <RiExpandUpDownFill />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
              <Select.Popup className="group origin-(--transform-origin) rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none dark:shadow-none dark:outline-gray-300">
                <Select.ScrollUpArrow className="top-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-top-full" />
                <Select.List className="relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1">
                  {types.map(({ label, value }) => (
                    <Select.Item
                      key={label}
                      value={value}
                      className="grid min-w-(--anchor-width) cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                    >
                      <Select.ItemIndicator className="col-start-1">
                        <FaCheck />
                      </Select.ItemIndicator>
                      <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
                <Select.ScrollDownArrow className="bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-bottom-full" />
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
      <p>Выберите диапазон дат</p>
      {selectableDateRanges.map((value, index) => (
        <AppendableInfoContainer
          key={index}
          prevInfoInitial={{ date: value }}
          onInfoChange={(info) => {
            if (!info.date || !info.date.from || !info.date.to) return [{ key: "date", message: "Выберите диапазон" }]
            setSelectableDateRanges((previ) => {
              const newi = [...previ]
              newi[index] = info.date
              return newi
            })
            return []
          }}
          onRemove={() => {
            setSelectableDateRanges((prev) => {
              const newInfo = prev.filter((_, i) => i !== index)
              return newInfo
            })
            return undefined
          }}
          className="flex flex-row justify-between"
          btnDivClassName="flex flex-row justify-between"
          btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
        >
          <DateRangePicker />
        </AppendableInfoContainer>
      ))}
      {selectableDateRanges.length > 0 && <div className="my-2 w-full border-2 border-b border-gray-300"></div>}
      <AppendableInfoContainer
        key={selectableDateRanges.length + "new"}
        onInfoChange={(info) => {
          if (!info.date || !info.date.from || !info.date.to) return [{ key: "date", message: "Выберите диапазон" }]
          setSelectableDateRanges((previ) => {
            return [...previ, info.date]
          })
          return []
        }}
        className="flex flex-row justify-between"
        btnDivClassName="flex flex-row justify-between"
        btnClassName="border-primary-accent bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/50 mt-2 h-[2.5rem] w-[6rem] rounded-2xl border"
      >
        <DateRangePicker />
      </AppendableInfoContainer>
    </div>
  )
}

function DateRangePicker() {
  const { info, setAppendableInfo, isEditable, error } = useContext(AppendableInfoContext)

  return (
    <div className="flex flex-row justify-between">
      {isEditable ? (
        <div className="text-text-alt flex items-center gap-2">
          <DatePicker
            type="single"
            className="border-border bg-bg-main-accent flex h-10 w-full items-center justify-between rounded-md border px-2"
            onPick={(date) => {
              // setAppendableInfo({ date })
              console.log("A")
            }}
            defaultDate={new Date(0)}
          />
        </div>
      ) : (
        <p>
          {formatDate(info.date.from)} - {formatDate(info.date.to)}
        </p>
      )}
    </div>
  )
}
