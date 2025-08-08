"use client"
import style from "@/styles/components/ui/dropdown.module.css"
import { FaChevronDown } from "react-icons/fa"
import { useState, useRef, useEffect, ReactNode, HTMLAttributes } from "react"
import clsx from "clsx"

interface DropdownOption<ValueType> {
  displayElement: ReactNode
  value: ValueType
  active: boolean
}

interface DropdownParams<ValueType> extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  options: DropdownOption<ValueType>[]
  onOptionSelect: (e: { selection: ValueType; isDefaultPrevented: boolean; closeDropdown: () => void }) => void
  defaultSelection: number | DropdownOption<ValueType>
  className?: string
  disabled?: boolean
  isAlwaysUp?: boolean
  onToggle?: (isOpened: boolean) => void
}

type TextOption<ValueType> = { displayName: string; value: ValueType; active: boolean }
interface TextDropdownParams<ValueType> extends Omit<DropdownParams<ValueType>, "options" | "defaultSelection"> {
  options: TextOption<ValueType>[]
  defaultSelection: number | TextOption<ValueType>
}

export function Dropdown<ValueType>({
  options,
  onOptionSelect,
  defaultSelection,
  className,
  disabled,
  isAlwaysUp,
  onToggle,
  ...rest
}: DropdownParams<ValueType>) {
  const [selectedOption, setSelectedOption] = useState<number | DropdownOption<ValueType>>(defaultSelection)
  const [isOpened, setIsOpened] = useState(false)
  useEffect(() => {
    setSelectedOption(defaultSelection)
  }, [defaultSelection])

  return (
    <div className={clsx(style.dropdownContainer, className, { [style.dropdownDisabled]: disabled })} {...rest}>
      <DropdownButton
        selectedOption={typeof selectedOption === "number" ? options[selectedOption] : selectedOption}
        onClick={(e) => {
          if (disabled) return
          setIsOpened(!isOpened)
          onToggle && onToggle(!isOpened)
        }}
        isOpened={isOpened}
      />
      <DropdownMenu
        options={options}
        onOptionSelect={(selection) => {
          if (!selection || disabled) return
          const selectEvent = {
            selection: selection.value,
            isDefaultPrevented: false,
            closeDropdown: () => setIsOpened(false),
          }
          onOptionSelect(selectEvent)
          if (selectEvent.isDefaultPrevented) return
          setIsOpened(false)
          setSelectedOption(selection)
        }}
        isOpened={isOpened}
        isAlwaysUp={isAlwaysUp ?? false}
      />
    </div>
  )
}

export function TextDropdown<ValueType>({ options, defaultSelection, ...rest }: TextDropdownParams<ValueType>) {
  const option2TextOption = (option: TextOption<ValueType>) => ({
    value: option.value,
    active: option.active,
    displayElement: <p className={style.dropdownText}>{option.displayName}</p>,
  })
  const optionList = options.map(option2TextOption)
  const defaultSel =
    typeof defaultSelection === "number" ? optionList[defaultSelection] : option2TextOption(defaultSelection)
  return <Dropdown options={optionList} defaultSelection={defaultSel} {...rest} />
}

function DropdownMenu<ValueType>({
  options,
  onOptionSelect,
  isOpened,
  isAlwaysUp,
}: {
  options: DropdownOption<ValueType>[]
  onOptionSelect: (selection: DropdownOption<ValueType> | null) => void
  isOpened: boolean
  isAlwaysUp: boolean
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<HTMLDivElement>(null)
  const [isDown, setIsDown] = useState(true)
  useEffect(() => {
    if (!menuRef.current) return
    if (isOpened) {
      menuRef.current.classList.remove(style.menuFading)
      menuRef.current.classList.remove(style.menuAppearing)
      menuRef.current.classList.add(style.menuAppearing)
      return
    }
    menuRef.current.classList.add(style.menuFading)
    if (menuRef.current.classList.contains(style.menuAppearing)) {
      const handleAnimationEnd = () => {
        if (!menuRef.current) return
        menuRef.current.classList.remove(style.menuFading)
        menuRef.current.classList.remove(style.menuAppearing)
        menuRef.current.removeEventListener("animationend", handleAnimationEnd)
      }
      menuRef.current.addEventListener("animationend", handleAnimationEnd)
    }
  }, [isOpened])

  useEffect(() => {
    console.log("Is down: ", isDown)
  }, [isDown])

  useEffect(() => {
    const isOverflowUp =
      positionRef.current?.getBoundingClientRect().y!! - menuRef.current?.getBoundingClientRect().height!! < 0
    const isOverflowDown =
      menuRef.current?.getBoundingClientRect().height!! + positionRef.current?.getBoundingClientRect().y!! >
      window.innerHeight
    console.log(
      "up: ",
      isOverflowUp,
      "down: ",
      isOverflowDown,
      "height: ",
      menuRef.current?.getBoundingClientRect().height!!
    )
    if (isOverflowDown) {
      setIsDown(false)
    } else {
      setIsDown(true)
    }
  }, [isOpened])

  return (
    <>
      <div ref={positionRef} style={{ border: "none" }} />
      <div
        className={clsx(style.dropdownMenu, { [style.down]: !isDown || isAlwaysUp }, { [style.shown]: isOpened })}
        style={{ position: "absolute" }}
        ref={menuRef}
      >
        {(!options || options.length == 0) && <p className={style.dropdownText}>--------</p>}
        {options &&
          options.map((option, index) => (
            <DropdownOption option={option} onClick={() => onOptionSelect(option)} key={index + 1}></DropdownOption>
          ))}
      </div>
    </>
  )
}

function DropdownButton<ValueType>({
  selectedOption,
  onClick,
  isOpened,
}: {
  selectedOption: DropdownOption<ValueType>
  onClick: (e: React.MouseEvent) => void
  isOpened: boolean
}) {
  return (
    <div className={clsx(style.dropdownButton, { [style.buttonOpened]: isOpened })} onClick={onClick}>
      <DropdownOption option={selectedOption} />
      <FaChevronDown className={style.arrowIcon} />
    </div>
  )
}

function DropdownOption<ValueType>({ option, onClick }: { option: DropdownOption<ValueType>; onClick?: () => void }) {
  return (
    <div
      className={clsx(style.dropdownOption, { [style.dropdownDisabled]: !option.active })}
      onClick={() => {
        if (!option.active || !onClick) return
        onClick()
      }}
    >
      {option.displayElement}
    </div>
  )
}
