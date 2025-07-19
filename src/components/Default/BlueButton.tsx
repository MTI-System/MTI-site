import style from "@/styles/components/bluebutton.module.css"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"

type BlueButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

function BlueButton({ children, className = "", ...rest }: BlueButtonProps) {
  const cls = `${style.blueButton} ${className}`
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

export default BlueButton
