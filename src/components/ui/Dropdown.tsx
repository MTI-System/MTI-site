// TODO: restyle, implement multiselection dropdown
import { Menu } from "@base-ui-components/react/menu"
import clsx from "clsx"
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import { FaChevronDown } from "react-icons/fa6"

export interface DropdownOptionInterface<ValueType> {
  children: ReactNode
  value: ValueType
  inactive?: boolean
}

interface dropdownContextInterface<ValueType> {
  selectedOption: (DropdownOptionInterface<ValueType> | null)[]
  selectOption: (option: DropdownOptionInterface<ValueType> | null) => void
  isOpen: boolean
}

const DropdownContext = createContext<dropdownContextInterface<any> | null>(null)

interface DropdownParams<T> extends Omit<Menu.Root.Props, "disabled"> {
  children: ReactNode[]
  trigger: ReactNode
  className?: string
  selectionState?: [DropdownOptionInterface<T> | null, Dispatch<SetStateAction<DropdownOptionInterface<T> | null>>]
  onOptionSelect?: (option: DropdownOptionInterface<T> | null) => void
}

export function Dropdown<T>({
  children,
  trigger,
  selectionState,
  onOptionSelect,
  className,
  ...rest
}: DropdownParams<T>) {
  if (!selectionState) selectionState = useState<DropdownOptionInterface<T> | null>(null)
  const [selection, setSelection] = selectionState
  const [isOpen, setIsOpen] = useState(false)
  const selectOption = (option: DropdownOptionInterface<T> | null) => {
    setSelection(option)
    onOptionSelect && onOptionSelect(option)
  }

  return (
    <DropdownContext
      value={{
        selectedOption: [selection],
        selectOption: selectOption,
        isOpen: isOpen,
      }}
    >
      <Menu.Root
        onOpenChange={(open, e, reason) => {
          setIsOpen(open)
          rest.onOpenChange && rest.onOpenChange(open, e, reason)
        }}
        modal={false}
        {...rest}
      >
        {trigger}
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup
              className={clsx(
                "dark:outline-gray-30 bg-bg-alt border-border max-h-[50vh] origin-[var(--transform-origin)] overflow-auto rounded-md border-1 shadow-md! shadow-black/50! transition-[transform,translate,opacity] data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1",
                className,
              )}
            >
              {children}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </DropdownContext>
  )
}

interface DropdownTriggerParams extends Menu.Trigger.Props {
  dontDisplaySelection?: boolean
  className?: string
}

export function DropdownTrigger({
  children,
  dontDisplaySelection,
  className,
  disabled,
  ...rest
}: DropdownTriggerParams) {
  const ddCtx = useContext(DropdownContext)

  const displayNode = !ddCtx?.selectedOption[0] || dontDisplaySelection ? children : ddCtx.selectedOption[0]?.children

  return (
    <Menu.Trigger disabled={disabled} className="bg-bg-alt rounded-md" {...rest}>
      <div
        className={clsx(
          "text-text-main ddtrig group/dropdownButton bg-bg-alt border-border flex flex-row content-between items-center gap-2 rounded-md border-1 p-2 transition hover:bg-black/10 dark:hover:bg-white/10",
          className,
          { "hover:bg-bg-alt! opacity-50": disabled },
        )}
      >
        {displayNode}
        <FaChevronDown
          className={clsx(
            "w-[25%] min-w-4 transition-transform duration-300 group-hover/dropdownButton:translate-y-0.5",
            {
              "group-hover/dropdownButton:translate-0!": disabled,
              "rotate-180 group-hover/dropdownButton:-translate-y-0.5!": ddCtx?.isOpen,
            },
          )}
        />
      </div>
    </Menu.Trigger>
  )
}

export function DropdownElement<T>(params: DropdownOptionInterface<T>) {
  const ddCtx = useContext(DropdownContext)
  return (
    <Menu.Item
      className={clsx(
        "bg-bg-alt text-text-main px-2 py-0.5 pr-10 transition-colors duration-300 hover:bg-black/10 dark:hover:bg-white/10 [.ddtrig_&]:pr-0",
        { "text-inactive": params.inactive },
      )}
      onClick={() => {
        if (params.inactive) return
        ddCtx?.selectOption(params)
      }}
    >
      {params.children}
    </Menu.Item>
  )
}
