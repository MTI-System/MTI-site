"use client"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { AUTH_API } from "@/components/constants"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [loginButtonState, setLoginButtonState] = useState<string>("Войти")
  const [loginText, setLoginText] = useState<string>("")
  const [passText, setPassText] = useState<string>("")
  const router = useRouter()
  return (
    <div>
      <input
        type={"text"}
        placeholder={"Логин"}
        onChange={(event) => {
          setLoginText(event.target.value)
        }}
      />
      <input
        type={"password"}
        placeholder={"Пароль"}
        onChange={(event) => {
          setPassText(event.target.value)
        }}
      />
      <button
        id={"login_button"}
        onClick={() => {
          setLoginButtonState("Loading...")
          const formData = new FormData()
          formData.append("username", loginText)
          formData.append("password", passText)
          console.log(formData.get("username"))
          fetch(AUTH_API + "login", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data === false) {
                alert("Не верные данные")
                setLoginButtonState("Войти")
              } else {
                localStorage.setItem("mti_auth_key", data)
                router.push("/profile")
              }
            })
        }}
      >
        {loginButtonState}
      </button>
    </div>
  )
}
