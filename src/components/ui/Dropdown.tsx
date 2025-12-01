import twclsx from "@/utils/twClassMerge"
import { Menu } from "@base-ui-components/react/menu"
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import { FaChevronDown } from "react-icons/fa6"

export interface DropdownOptionInterface<ValueType> {
  children: ReactNode
  value: ValueType
  inactive?: boolean
}

interface DropdownRootProps extends Menu.Root.Props {
  children: ReactNode[]
  trigger: ReactNode
  className?: string
}

function DropdownRoot({ children, trigger, className, ...rest }: DropdownRootProps) {
  return (
    <Menu.Root {...rest}>
      {trigger}
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} className="z-10">
          <Menu.Popup
            className={twclsx(
              "dark:outline-gray-30 bg-bg-alt border-border max-h-[50vh] origin-(--transform-origin) overflow-auto rounded-md border shadow-md! shadow-black/50! transition-[transform,translate,opacity] data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1",
              className,
            )}
          >
            {children.length > 0 ? children : <p className="px-10 py-2">-----------</p>}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

interface dropdownContextInterface<ValueType> {
  selectedOption: DropdownOptionInterface<ValueType> | DropdownOptionInterface<ValueType>[] | null
  selectOption: (option: DropdownOptionInterface<ValueType> | null) => void
  isOpen: boolean
}

const DropdownContext = createContext<dropdownContextInterface<any> | null>(null)

interface DropdownParams<T> extends DropdownRootProps {
  selectionState?: [DropdownOptionInterface<T> | null, Dispatch<SetStateAction<DropdownOptionInterface<T> | null>>]
  onOptionSelect?: (option: DropdownOptionInterface<T> | null) => void
}

export function Dropdown<T>({ selectionState, onOptionSelect, ...rest }: DropdownParams<T>) {
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
        selectedOption: selection,
        selectOption: selectOption,
        isOpen: isOpen,
      }}
    >
      <DropdownRoot
        onOpenChange={(open, e) => {
          setIsOpen(open)
          rest.onOpenChange && rest.onOpenChange(open, e)
        }}
        modal={false}
        {...rest}
      />
    </DropdownContext>
  )
}

interface DropdownMultiParams<T> extends Omit<DropdownRootProps, "onOpenChange"> {
  onOpenChange?: (
    open: boolean,
    e: Menu.Root.ChangeEventDetails,
    selection: DropdownOptionInterface<T>[] | null,
  ) => void
  selectionState?: [DropdownOptionInterface<T>[] | null, Dispatch<SetStateAction<DropdownOptionInterface<T>[] | null>>]
  onOptionClick?: (option: DropdownOptionInterface<T> | null, isSelected: boolean) => void
}

export function DropdownMulti<T>({
  selectionState,
  onOptionClick: onOptionSelect,
  onOpenChange,
  ...rest
}: DropdownMultiParams<T>) {
  if (!selectionState) selectionState = useState<DropdownOptionInterface<T>[] | null>(null)
  const [selection, setSelection] = selectionState
  const [isOpen, setIsOpen] = useState(false)
  const selectOption = (option: DropdownOptionInterface<T> | null) => {
    setSelection((prev) => {
      if (!option) return null
      const isSelected = prev?.find((o) => o.value === option.value) === undefined
      onOptionSelect && onOptionSelect(option, isSelected)
      let ret = prev ? [...prev] : []
      if (isSelected) ret.push(option)
      else ret = ret.filter((o) => o.value !== option.value)
      return ret.length === 0 ? null : ret
    })
  }

  return (
    <DropdownContext
      value={{
        selectedOption: selection,
        selectOption: selectOption,
        isOpen: isOpen,
      }}
    >
      <DropdownRoot
        onOpenChange={(open, e) => {
          setIsOpen(open)
          onOpenChange && onOpenChange(open, e, selection)
        }}
        modal={false}
        {...rest}
      />
    </DropdownContext>
  )
}

interface DropdownTriggerParams extends Menu.Trigger.Props {
  dontDisplaySelection?: boolean
  className?: string
  rootClassName?: string
}

export function DropdownTrigger({
  children,
  dontDisplaySelection,
  className,
  rootClassName,
  disabled,
  ...rest
}: DropdownTriggerParams) {
  const ddCtx = useContext(DropdownContext)

  // const displayNode = !ddCtx?.selectedOption || dontDisplaySelection ? children : ddCtx.selectedOption?.children
  const displayNode =
    !ddCtx?.selectedOption || dontDisplaySelection ? (
      children
    ) : Array.isArray(ddCtx.selectedOption) ? (
      ddCtx.selectedOption.length > 0 ? (
        <p className="flex-1">Выбрано {ddCtx.selectedOption.length} элементов</p>
      ) : (
        children
      )
    ) : (
      ddCtx.selectedOption.children
    )

  return (
    <Menu.Trigger disabled={disabled} {...rest} className={rootClassName}>
      <div
        className={twclsx(
          "text-text-main ddtrig group/dropdownButton bg-bg-alt border-border flex flex-row content-between items-center gap-2 rounded-md border p-2 transition hover:bg-black/10 dark:hover:bg-white/10",
          className,
          { "hover:bg-bg-alt opacity-50": disabled },
        )}
      >
        {displayNode}
        <FaChevronDown
          className={twclsx("w-4 transition-transform duration-300 group-hover/dropdownButton:translate-y-0.5", {
            "rotate-180 group-hover/dropdownButton:-translate-y-0.5": ddCtx?.isOpen,
            "group-hover/dropdownButton:translate-0": disabled,
          })}
        />
      </div>
    </Menu.Trigger>
  )
}

export function DropdownElement<T>(params: DropdownOptionInterface<T>) {
  const ddCtx = useContext(DropdownContext)
  return (
    <Menu.Item
      className={twclsx(
        "bg-bg-alt text-text-main px-2 py-0.5 pr-10 transition-colors duration-300 hover:bg-black/10 dark:hover:bg-white/10 in-[.ddtrig]:pr-0",
        { "text-inactive opacity-50": params.inactive },
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

export function DropdownMultiElement<T>(params: DropdownOptionInterface<T>) {
  const ddCtx = useContext(DropdownContext)
  return (
    <Menu.CheckboxItem
      className={twclsx(
        "bg-bg-alt text-text-main px-2 py-0.5 transition-colors duration-300 hover:bg-black/10 data-checked:bg-black/4 data-checked:hover:bg-black/7 dark:hover:bg-white/10 dark:data-checked:bg-white/4 dark:data-checked:hover:bg-white/7 in-[.ddtrig]:pr-0",
        { "text-inactive opacity-50": params.inactive },
      )}
      checked={
        Array.isArray(ddCtx?.selectedOption) &&
        ddCtx?.selectedOption?.find((o) => o.value === params.value) !== undefined
      }
      onCheckedChange={() => {
        if (params.inactive) return
        ddCtx?.selectOption(params)
      }}
    >
      {params.children}
    </Menu.CheckboxItem>
  )
}
