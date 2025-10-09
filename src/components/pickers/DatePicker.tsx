import { Popover } from "@base-ui-components/react/popover"
import { useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import { FaEdit } from "react-icons/fa"


interface SingleDatePicker {
  type: "single"
  onPick: (data: Date) => void
}

interface RangeDatePicker {
  type: "range"
  onPick: (data: DateRange) => void
}

type DatePickerProps = SingleDatePicker | RangeDatePicker

export default function DatePicker({ onPick, type }: DatePickerProps) {
  const [selected, setSelected] = useState()
  const [isPopoverOpened, setIsPopoverOpened] = useState(false)

  const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};


  return (
    <Popover.Root open={isPopoverOpened} onOpenChange={(e)=>{
        setIsPopoverOpened(e)
        if (!e){
            if (!selected) return
            onPick(selected)
        }
    }}>
      <Popover.Trigger className="">
        <div className="flex items-center gap-2 hover:text-accent-primary transition-colors cursor-pointer">
            <span className="text-[0.8rem]">{formatDate(selected?.from)}-{formatDate(selected?.to)}</span>
            <FaEdit />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner className="relative z-2" sideOffset={8} align={"end"}>
          <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <DayPicker
              mode={type}
              onSelect={setSelected as any}
              selected={selected}
              required={true}
              animate
              classNames={{
                month_grid: "border-separate border-spacing-0",
                today: `border-border border rounded-full`,
                range_middle: "bg-accent-primary/50",
                selected: `bg-accent-primary text-text-on-accent rounded-none! border-none!`,
                range_start: "rounded-l-full! shadow-[2px_0_4px_rgba(from_var(--color-accent-primary)_r_g_b/0.3)]",
                range_end: "rounded-r-full! shadow-[-2px_0_4px_rgba(from_var(--color-accent-primary)_r_g_b/0.3)]",
              }}
            />
            <button
              onClick={() => {
                if (!selected) return
                onPick(selected)
                setIsPopoverOpened(false)
              }}
              className="bg-accent-primary/25 hover:bg-accent-primary/50 text-accent-primary border-accent-primary mt-[1rem] w-full rounded-2xl border-3 p-2"
            >
              Применить
            </button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
