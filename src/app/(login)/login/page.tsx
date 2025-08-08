"use client"
import style from "@/styles/routes/(login)/login.module.css"
import { useState, FormEvent, useRef, Suspense } from "react"
import { AUTH_API } from "@/constants/APIEndpoints"
import { useRouter, useSearchParams } from "next/navigation"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import { IconInput, TitledInput } from "@/components/ui/Input"
import Loading from "@/app/loading"
import cookies from "js-cookie"
import { AUTH_TOKEN_KEY_NAME } from "@/constants/CookieKeys"
import { Button } from "@/components/ui/Buttons"
import LogoWithTT from "@/components/sections/app/LogoWithTT"
import { setAuth, setToken } from "@/redux_stores/AuthSlice"
import { useAppDispatch } from "@/redux_stores/tournamentTypeRedixStore"
import { fetchSendLogin } from "@/scripts/ApiFetchers"
import footerStyle from "@/styles/components/sections/app/footer.module.css"

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
    <>
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    </>
  )
}

function LoginPage() {
  const [formState, setFormState] = useState<FormState>(FormState.AwaitLogin)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "profile"
  const dispatcher = useAppDispatch()

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
    const token = await fetchSendLogin(formData)
    if (token === null) {
      setFormState(FormState.UnknownError)
      return
    }
    if (!token) {
      setFormState(FormState.IncorrectData)
      return
    }
    dispatcher(setToken(token))
    // dispatcher(setAuth())
    cookies.set(AUTH_TOKEN_KEY_NAME, token)
    router.replace("/" + redirect)
  }

  function handleEnter() {
    if (!formRef.current) return
    handleLogin(formRef.current)
  }

  return (
    <div className={style.loginContainer}>
      <div className={style.login}>
        <LogoWithTT logoSize={"7rem"} margin={"-4rem"}>
          <h2 className={footerStyle.mainBioHeaderText} style={{ fontSize: "7rem" }}>
            МТИ
          </h2>
        </LogoWithTT>
        <div className={style.infoDiv}>
          <h2 className={style.infoHeader}>ВОЙТИ В АККАУНТ</h2>
          <p className={style.infoText}>Войдите в аккаунт, чтобы получить доступ к функциям организаторов</p>
        </div>
        <form className={style.formStyle} onSubmit={handleSubmit} ref={formRef}>
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
              icon={<></>}
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
            {formState === FormState.Loading ? "ЗАГРУЗКА..." : "ВОЙТИ"}
          </Button>
        </form>
      </div>
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
