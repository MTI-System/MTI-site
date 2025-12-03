"use client"
import { useState, FormEvent, useRef, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Loading from "@/app/loading"
import cookies from "js-cookie"
import { AUTH_TOKEN_KEY_NAME } from "@/constants/CookieKeys"
import { Button } from "@/components/ui/Buttons"
import { setToken } from "@/redux_stores/Global/AuthSlice"
import { useAppDispatch } from "@/redux_stores/Global/tournamentTypeRedixStore"
import AuthProviderWrapper from "@/api/auth/ClientWrapper"
import { useLoginMutation } from "@/api/auth/clientApiInterface"
import LogoWithTT from "@/components/ui/LogoWithTT"
import { Field, Form } from "@base-ui-components/react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import LoginLayout from "@/components/login/mainLayout"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <AuthProviderWrapper>
        <Suspense fallback={<Loading />}>
          <LoginPage />
        </Suspense>
      </AuthProviderWrapper>
    </>
  )
}

function LoginPage() {
  const isErrorInQuery = useRef<boolean>(false)
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string}>({})
  const router = useRouter()

  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "profile"
  const dispatcher = useAppDispatch()

  const [
    login,
    {
      data, // Ответ от сервера
      error, // Объект ошибки
      isLoading, // Запрос выполняется
      isSuccess, // Запрос успешно завершен
      isError,
      isUninitialized,
      reset,
      originalArgs,
      requestId,
    },
  ] = useLoginMutation()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await handleLogin(event.currentTarget)
  }

  async function handleLogin(form: HTMLFormElement) {
    const formData = new FormData(form)
    const newFormErrors: { username?: string; password?: string; } = {}
    const email = formData.get("username")
    if (email === "") newFormErrors.username = "Логин не может быть пустым"
    const password = formData.get("password")
    if (password === "") newFormErrors.password = "Пароль не можетр быть пустым"
    if (newFormErrors.username || newFormErrors.password) {
      setFormErrors(newFormErrors)
      return
    }
    login({ formData: formData })
  }
  useEffect(() => {
    if (!error) return
    if ((error as FetchBaseQueryError).status === 401) {
      setFormErrors({ username: "Неверный логин", password: "Или пароль" })
      isErrorInQuery.current = true
    } else {
      setFormErrors({ username: "Произошла неизвестная ошибка", password: "Попробуйте позже" })
      isErrorInQuery.current = true
    }
  }, [error])
  useEffect(() => {
    console.log("data", data)
    if (isSuccess && data) {
      dispatcher(setToken(data))
      cookies.set(AUTH_TOKEN_KEY_NAME, data)
      router.replace("/" + redirect)
    }
  }, [isSuccess])

  return (
    <LoginLayout
      title="ВОЙТИ В АККАУНТ"
      description="Войдите в аккаунт, чтобы получить доступ к функциям организаторов"
    >
      <Form className="flex w-full flex-col items-center gap-5" onSubmit={handleSubmit} errors={formErrors}>
        <Field.Root name="username" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Логин</Field.Label>
          <Field.Error className="text-md text-accent-warning" match="customError" />
          <Field.Control
            type="username"
            placeholder="Ваш ник"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-text-alt focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"
            
          />
        </Field.Root>
        <Field.Root name="password" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Пароль</Field.Label>
          <Field.Error className="text-md text-accent-warning" match="customError" />
          <Field.Control
            type="password"
            placeholder="Имя Вашего Кота"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-text-alt focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"
          />
        </Field.Root>
        <Button
          className="bg-accent-primary-alt border-accent-primary text-accent-primary h-15 w-full rounded-xl border-2 text-2xl font-bold"
          disabled={isLoading}
          type="submit"
          onClick={() => {
            if (isErrorInQuery.current) setFormErrors({})
            isErrorInQuery.current = false
          }}
        >
          {isLoading ? "ЗАГРУЗКА..." : "ВОЙТИ"}
        </Button>
        <p className="text-text-main">
          Нет аккаунта?{" "}
          <Link className="text-accent-primary font-medium hover:underline" href="/register">
            Зарегистрируйтесь
          </Link>
        </p>
      </Form>
    </LoginLayout>
  )
}
