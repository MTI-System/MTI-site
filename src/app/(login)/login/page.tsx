"use client"
import { useEffect, useState, FormEvent, useRef } from "react"
import { AUTH_API } from "@/constants/APIEndpoints"
import { useRouter } from "next/navigation"
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa6"
import { IconInput } from "@/components/ui/Input"
import style from "@/styles/app/login.module.css"

enum FormState {
  AwaitLogin,
  Loading,
  EmptyUsername,
  EmptyPassword,
  IncorrectData,
  UnknownError,
}

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>(FormState.AwaitLogin)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await handleLogin(event.currentTarget)
  }

  async function handleLogin(form: HTMLFormElement) {
    const formData = new FormData(form)
    const email = formData.get("username")
    if (email === "") {
      setFormState(FormState.EmptyUsername)
      return
    }
    const password = formData.get("password")
    if (password === "") {
      setFormState(FormState.EmptyPassword)
      return
    }
    setFormState(FormState.Loading)
    const response = await fetch(AUTH_API + "login", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const data: string = await response.json()
      if (!data) {
        console.log("Wrong credentials")
        setFormState(FormState.IncorrectData)
        return
      }
      localStorage.setItem("mti_auth_key", data)
      router.push("/profile")
    } else {
      console.log("Error?")
      setFormState(FormState.UnknownError)
    }
  }
  function handleEnter() {
    if (!formRef.current) return
    handleLogin(formRef.current)
  }

  return (
    <div className={style.loginContainer}>
      <form onSubmit={handleSubmit} className={style.login} ref={formRef}>
        <IconInput
          icon={<FaUser></FaUser>}
          onEnter={handleEnter}
          type="username"
          name="username"
          placeholder="email@example.xyz"
          disabled={formState === FormState.Loading}
          required
        ></IconInput>
        <PasswordField onEnter={handleEnter} disabled={formState === FormState.Loading} />
        <button type="submit" className={style.loginButton} disabled={formState === FormState.Loading}></button>
      </form>
      {/* <input
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
      </button> */}
    </div>
  )
}

function PasswordField({ onEnter, disabled }: { onEnter: (el: HTMLInputElement) => void; disabled: boolean }) {
  const [isHidden, setIsHidden] = useState(true)
  return (
    <IconInput
      icon={
        isHidden ? (
          <FaEyeSlash
            onClick={(e) => {
              // e.stopPropagation()
              setIsHidden(false)
            }}
          />
        ) : (
          <FaEye
            onClick={(e) => {
              // e.stopPropagation()
              setIsHidden(true)
            }}
          />
        )
      }
      onEnter={onEnter}
      type={isHidden ? "password" : "text"}
      name="password"
      placeholder=""
      disabled={disabled}
      required
    ></IconInput>
  )
}
