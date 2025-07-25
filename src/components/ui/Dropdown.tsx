"use client"
import style from "@/styles/components/dropdown.module.css"
import { FaChevronDown } from "react-icons/fa"
import { useState, useRef, useEffect, ReactNode } from "react"

interface DropdownOption<ValueType> {
  displayElement: ReactNode
  value: ValueType
  active: boolean
}

interface DropdownParams<ValueType> {
  options: DropdownOption<ValueType>[]
  onOptionSelect: (selection: ValueType) => void
  defaultSelection: number | DropdownOption<ValueType>
  className?: string
  disabled?: boolean
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
}: DropdownParams<ValueType>) {
  const [selectedOption, setSelectedOption] = useState<number | DropdownOption<ValueType>>(defaultSelection)
  const [isOpened, setIsOpened] = useState(false)
  const containerClassName = `${className ?? ""} ${style.dropdownContainer} ${disabled && style.dropdownDisabled}`
  useEffect(() => {
    setSelectedOption(defaultSelection)
  }, [defaultSelection])
  return (
    <div className={containerClassName}>
      <DropdownButton
        selectedOption={typeof selectedOption === "number" ? options[selectedOption] : selectedOption}
        onClick={(e) => {
          if (disabled) return
          setIsOpened((prev) => !prev)
        }}
        isOpened={isOpened}
      />
      <DropdownMenu
        options={options}
        onOptionSelect={(selection) => {
          setIsOpened(false)
          if (!selection || disabled) return
          setSelectedOption(selection)
          onOptionSelect(selection.value)
        }}
        isOpened={isOpened}
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
}: {
  options: DropdownOption<ValueType>[]
  onOptionSelect: (selection: DropdownOption<ValueType> | null) => void
  isOpened: boolean
}) {
  const menuRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={style.dropdownMenu} style={{ position: "absolute" }} ref={menuRef}>
      {!options && <p>No options</p>}
      {options &&
        options.map((option, index) => (
          <DropdownOption option={option} onClick={() => onOptionSelect(option)} key={index + 1}></DropdownOption>
        ))}
    </div>
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
  const className = `${style.dropdownButton} ${isOpened && style.buttonOpened}`
  return (
    <div className={className} onClick={onClick}>
      <DropdownOption option={selectedOption} />
      <FaChevronDown className={style.arrowIcon} />
    </div>
  )
}

function DropdownOption<ValueType>({ option, onClick }: { option: DropdownOption<ValueType>; onClick?: () => void }) {
  const className = `${style.dropdownOption} ${!option.active ? style.optionDisabled : ""}`
  return (
    <div
      className={className}
      onClick={() => {
        if (!option.active || !onClick) return
        onClick()
      }}
    >
      {option.displayElement}
    </div>
  )
}
