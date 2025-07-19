import styleModule from "@/styles/components/bluebutton.module.css"
import { ButtonHTMLAttributes, CSSProperties, PropsWithChildren } from "react"

type CSSVariableStyle = React.CSSProperties & {
  "--main-color"?: string
  "--main-light-color"?: string
}
type BlueButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  style?: CSSVariableStyle
}
/**
 * Features prestyled button. You can change colors using **style** parameter by providing CSS variables:
 * **--main-color** and **--main-light-color**
 */
function Button({ children, className = "", style, ...rest }: BlueButtonProps) {
  const cls = `${styleModule.button} ${className}`
  return (
    <button className={cls} style={style} {...rest}>
      {children}
    </button>
  )
}

export default Button
