// TODO: restyle, implement multiselection dropdown
import { Menu } from "@base-ui-components/react/menu"
import clsx from "clsx"
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"
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

const DropdownContext = createContext<dropdownContextInterface<any> | null>(
  null,
)

interface DropdownParams<T> extends Menu.Root.Props {
  children: ReactNode[]
  trigger: ReactNode
  className?: string
  selectionState?: [
    DropdownOptionInterface<T> | null,
    Dispatch<SetStateAction<DropdownOptionInterface<T> | null>>,
  ]
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
  if (!selectionState)
    selectionState = useState<DropdownOptionInterface<T> | null>(null)
  const [selection, setSelection] = selectionState
  const [isOpen, setIsOpen] = useState(false)
  const selectOption = (option: DropdownOptionInterface<T> | null) => {
    console.log(option)
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
        {...rest}
      >
        {trigger}
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup
              className={clsx(
                "dark:outline-gray-30 max-h-[50vh] origin-[var(--transform-origin)] overflow-auto rounded-md bg-gray-400 shadow-md! shadow-black/50! outline-1 outline-gray-300 transition-[transform,translate,opacity] data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1",
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

export function DropdownTrigger({
  children,
  dontDisplaySelection,
  className,
}: {
  children: ReactNode
  dontDisplaySelection?: boolean
  className?: string
}) {
  const ddCtx = useContext(DropdownContext)

  const displayNode =
    !ddCtx?.selectedOption[0] || dontDisplaySelection
      ? children
      : ddCtx.selectedOption[0]?.children
  console.log(ddCtx?.selectedOption)

  return (
    <Menu.Trigger>
      <div
        className={clsx(
          "group/dropdownButton flex flex-row content-between items-center gap-2 rounded-md border-1 border-gray-400 bg-red-100 p-2 transition-colors hover:bg-red-200",
          className,
        )}
      >
        {displayNode}
        <FaChevronDown
          className={clsx(
            "min-w-4 transition-transform duration-300 group-hover/dropdownButton:translate-y-0.5",
            {
              "rotate-180 group-hover/dropdownButton:-translate-y-0.5!":
                ddCtx?.isOpen,
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
      className="bg-gray-500 px-2 py-0.5 transition-colors duration-300 hover:bg-gray-600"
      onClick={() => {
        if (params.inactive) return
        ddCtx?.selectOption(params)
      }}
    >
      {params.children}
    </Menu.Item>
  )
}
