"use client"
import { useState, FormEvent, useRef, Suspense } from "react"
import { AUTH_API } from "@/constants/APIEndpoints"
import { useRouter, useSearchParams } from "next/navigation"
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa6"
import { IconInput, TitledInput } from "@/components/ui/Input"
import style from "@/styles/app/login.module.css"
import Loading from "@/app/(main)/loading"
import cookies from "js-cookie"
import { AUTH_TOKEN_KEY_NAME } from "@/constants/CookieKeys"
import { Button } from "@/components/ui/Buttons"

enum FormState {
  AwaitLogin,
  Loading,
  EmptyUsername,
  EmptyPassword,
  IncorrectData,
  UnknownError,
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  )
}

function LoginPage() {
  const [formState, setFormState] = useState<FormState>(FormState.AwaitLogin)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "profile"

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
      cookies.set(AUTH_TOKEN_KEY_NAME, data)
      router.replace("/" + redirect)
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
        <TitledInput
          title={
            formState === FormState.EmptyUsername
              ? "Username can't be empty"
              : formState === FormState.IncorrectData
              ? "Incorrect username"
              : "Username"
          }
          isError={formState === FormState.EmptyUsername || formState === FormState.IncorrectData}
        >
          <IconInput
            icon={<FaUser></FaUser>}
            onEnter={handleEnter}
            type="username"
            name="username"
            placeholder="email@example.xyz"
            disabled={formState === FormState.Loading}
          ></IconInput>
        </TitledInput>

        <TitledInput
          title={
            formState === FormState.EmptyPassword
              ? "Password field can't be empty"
              : formState === FormState.IncorrectData
              ? "Or password"
              : "Password"
          }
          isError={formState === FormState.EmptyPassword || formState === FormState.IncorrectData}
        >
          <PasswordField onEnter={handleEnter} disabled={formState === FormState.Loading} />
        </TitledInput>
        <Button type="submit" className={style.loginButton} disabled={formState === FormState.Loading}>
          {formState === FormState.Loading ? "Loading..." : "Login"}
        </Button>
      </form>
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
              setIsHidden(false)
            }}
          />
        ) : (
          <FaEye
            onClick={(e) => {
              setIsHidden(true)
            }}
          />
        )
      }
      onEnter={onEnter}
      type={isHidden ? "password" : "text"}
      name="password"
      placeholder="NameOfTheCat"
      disabled={disabled}
    ></IconInput>
  )
}
