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
    displayElement: <p className="">{option.displayName}</p>,
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
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== menuRef.current) return
      if (e.propertyName !== "transform") return
      menuRef.current?.classList.remove(style.animating)
      console.log("isOpened", isOpened)

      console.log("TransitionEnd", e.propertyName)
    }
    const handleTransitionStart = (e: TransitionEvent) => {
      if (e.target !== menuRef.current) return
      if (e.propertyName !== "transform") return
      menuRef.current?.classList.add(style.animating)
      console.log("TransitionStart", e.propertyName)
    }
    menuRef.current?.addEventListener("transitionend", handleTransitionEnd)
    menuRef.current?.addEventListener("transitionstart", handleTransitionStart)
    return () => {
      menuRef.current?.removeEventListener("transitionend", handleTransitionEnd)
      menuRef.current?.removeEventListener("transitionstart", handleTransitionStart)
    }
  }, [])

  useEffect(() => {
    isOpened && menuRef.current?.classList.add(style.shown, style.animating)
  }, [isOpened])

  useEffect(() => {
    const isOverflowUp =
      positionRef.current?.getBoundingClientRect().y!! - menuRef.current?.getBoundingClientRect().height!! < 0
    const isOverflowDown =
      menuRef.current?.getBoundingClientRect().height!! + positionRef.current?.getBoundingClientRect().y!! >
      window.innerHeight
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
        {(!options || options.length == 0) && <p className="">--------</p>}
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
