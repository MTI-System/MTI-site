"use client"
import style from "@/styles/components/dropdown.module.css"
import { FaChevronDown } from "react-icons/fa"
import { useState, useRef, useEffect } from "react"

interface DropdownOption<ValueType> {
  displayName: string
  value: ValueType
  active: boolean
}

export function StaticDropdown<ValueType>({
  options,
  onOptionSelect,
  defaultSelection,
  className,
  disabled,
}: {
  options: DropdownOption<ValueType>[]
  onOptionSelect: (selection: ValueType) => void
  defaultSelection: number | DropdownOption<ValueType>
  className?: string
  disabled?: boolean
}) {
  const [selectedOption, setSelectedOption] = useState<number | DropdownOption<ValueType>>(defaultSelection)
  const [isOpened, setIsOpened] = useState(false)

  const containerClassName = `${className ?? ""} ${style.dropdownContainer}`

  return (
    <div className={containerClassName}>
      <DropdownButton
        selectedOption={typeof selectedOption === "number" ? options[selectedOption] : selectedOption}
        onClick={(e) => {
          setIsOpened((prev) => !prev)
        }}
        isOpened={isOpened}
      />
      <DropdownMenu
        options={options}
        onOptionSelect={(selection) => {
          setIsOpened(false)
          if (!selection) return
          setSelectedOption(selection)
          onOptionSelect(selection.value)
        }}
        isOpened={isOpened}
      />
    </div>
  )
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
      <DropdownOption option={selectedOption}></DropdownOption>
      <FaChevronDown className={style.arrowIcon}></FaChevronDown>
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
      {option.displayName}
    </div>
  )
}
