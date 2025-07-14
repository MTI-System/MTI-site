import style from "@/styles/components/bluebutton.module.css"
import {ButtonHTMLAttributes, PropsWithChildren} from "react";

type BlueButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

function BlueButton({ children, className = "", ...rest }: BlueButtonProps) {
  return(
    <button className={style.blueButton} {...rest}>{children}</button>
  )
}

export default BlueButton