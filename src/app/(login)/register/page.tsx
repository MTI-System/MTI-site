"use client"
import { useIsLoginTakenMutation, useRegisterMutation } from "@/api/auth/clientApiInterface"
import LoginLayout from "@/components/login/mainLayout"
import DatePicker from "@/components/pickers/DatePicker"
import { Button } from "@/components/ui/Buttons"
import { FILES_SERVER } from "@/constants/APIEndpoints"
import { AUTH_TOKEN_KEY_NAME } from "@/constants/CookieKeys"
import { Checkbox, Field, Form } from "@base-ui-components/react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import cookies from "js-cookie"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { z } from "zod"

interface RegisterFormData {
  email?: string
  login?: string
  password?: string
  usersFirstName?: string
  usersSecondName?: string
  usersThirdName?: string
  usersBirthday?: number
  parentFirstName?: string
  parentSecondName?: string
  parentThirdName?: string
  parentBirthday?: number
  parentContact?: string
}

const formCardClass =
  "flex w-full max-w-3xl flex-col gap-6 rounded-2xl bg-bg-alt py-5 overflow-visible max-h-[calc(100vh-6rem)] min-h-[14rem] sm:min-h-[20rem] lg:min-h-[26rem] min-w-[18rem]"
const fieldRootClass = "flex w-full flex-col items-start gap-1 text-text-main"
const fieldLabelClass = "text-sm font-semibold uppercase tracking-wide text-text-alt"
const fieldErrorClass = "text-sm font-medium text-red-600"
const inputClass =
  "h-15 w-full rounded-xl border border-border bg-bg-alt px-4 text-lg text-text-main placeholder:text-gray-400 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main"
const actionButtonClass =
  "bg-accent-primary-alt border border-accent-primary text-accent-primary h-15 w-full rounded-xl font-semibold tracking-wide transition duration-200 outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main disabled:cursor-not-allowed disabled:opacity-70"
const inlineGridClass = "grid w-full gap-5 md:grid-cols-2"
const datePickerClass =
  "outline-none flex h-15 w-full items-center justify-between rounded-xl border border-border bg-bg-alt px-4 text-lg text-text-main transition duration-200 focus-within:ring-2 focus-within:ring-accent-primary focus-within:ring-offset-2 focus-within:ring-offset-bg-main"
const policyCardClass =
  "flex w-full h-15 flex-col gap-3 rounded-xl border border-border bg-bg-alt p-4 text-sm leading-relaxed text-text-main sm:flex-row sm:items-center sm:justify-between sm:gap-4 select-none"
const checkboxRootClass =
  "flex size-5 items-center justify-center rounded-md border border-border bg-bg-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main data-checked:border-transparent data-checked:bg-text-main"

export default function Page() {
  const [displayedStep, setDisplayedStep] = useState(1)
  const [formData, setFormData] = useState<RegisterFormData>({})
  const [register, { data, isLoading, error, isSuccess }] = useRegisterMutation()
  const router = useRouter()
  const handleRegister = useCallback(
    (addData: RegisterFormData) => {
      const fd = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value)
      })
      Object.entries(addData).forEach(([key, value]) => {
        fd.append(key, value)
      })
      console.log("fd", fd)
      register({ formData: fd })
    },
    [formData, register],
  )
  // ------------------------------
  useEffect(() => {
    if (isSuccess && data) cookies.set(AUTH_TOKEN_KEY_NAME, data)
  }, [isSuccess])

  let displayForm = <></>
  let displayedTitle = ""
  let displayedDescription = ""
  switch (displayedStep) {
    case 1:
      displayForm = (
        <Step1
          onStepComplete={(data) => {
            console.log("1---", data)
            setFormData((prev) => ({ ...prev, ...data }))
            setDisplayedStep(2)
          }}
        ></Step1>
      )
      displayedTitle = "СОЗДАЙТЕ АККАУНТ"
      displayedDescription = "Создайте аккаунт чтобы участвовать в соревнованиях, получать призы, и что то еще."
      break
    case 2:
      displayForm = (
        <Step2
          onStepComplete={(data) => {
            console.log("2---", data)
            setFormData((prev) => ({ ...prev, ...data }))
            if (calculateAge(new Date(data.usersBirthday!!)) < 14) setDisplayedStep(3)
            else {
              setDisplayedStep(4)
              handleRegister(data)
            }
          }}
        ></Step2>
      )
      displayedTitle = "РАССКАЖИТЕ О СЕБЕ"
      displayedDescription = "Расскажите нам о себе, чтобы мы могли рекомендовать вам подходящие мероприятия."
      break
    case 3:
      displayForm = (
        <Step3
          onStepComplete={(data) => {
            console.log("3---", data)
            setFormData((prev) => ({ ...prev, ...data }))
            setDisplayedStep(4)
            handleRegister(data)
          }}
        ></Step3>
      )
      displayedTitle = "НЕБОЛЬШАЯ ЗАМИНКА"
      displayedDescription =
        "Вам не исполнилось 14 лет, а значит вы не можете дать нам согласие на ОПД. Для продолжения регистрации необходимо, чтобы согласие на ОПД дал Ваш законный представитель"
      break
    case 4:
      displayForm = (
        <Button
          disabled={isLoading}
          className={`${actionButtonClass} text-xl md:text-2xl`}
          onClick={() => {
            if (error) {
              setDisplayedStep(1)
              setFormData({})
            } else redirect("/")
          }}
        >
          {isLoading ? "Загрузка..." : error ? "Попробовать ещё раз" : "Ура, идём на главную"}
        </Button>
      )
      displayedTitle = isLoading ? "ПОЧТИ ГОТОВО..." : error ? "ОШИБКА" : "ПОЗДРАВЛЯЕМ!"
      displayedDescription = isLoading
        ? "Мы собираем все данные и создаем для вас аккаунт. Это займет некоторое время."
        : error
          ? `Произошла ошибка при регистрации. Попробуйте позже. Код ошибки: ${(error as FetchBaseQueryError).status}`
          : "Вы успешно зарегистрировались в системе. Теперь вы можете начать использовать все возможности нашего сервиса."
      break
  }

  return (
    <LoginLayout title={displayedTitle} description={displayedDescription}>
      {displayForm}
    </LoginLayout>
  )
}

const Step1Schema = z
  .object({
    login: z.string().nonempty("Имя пользователя не может быть пустым"),
    password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
    passwordConfirm: z.string().min(8, "Пароль должен быть не менее 8 символов"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают",
  })

type Step1Interface = Omit<z.infer<typeof Step1Schema>, "passwordConfirm">

function Step1({ onStepComplete }: { onStepComplete: (data: Step1Interface) => void }) {
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState<z.infer<typeof Step1Schema>|null>(null)

  const [checkLogin, { data: isLoginTaken, isLoading, error, isSuccess } ] = useIsLoginTakenMutation()

  useEffect(() => {
    if (!formData) return
    if (!isSuccess && !isLoading) {
      setFormErrors({ login: "Не удалось проверить свободность имени пользователя" })
      console.error("Error checking login availability", error)
      return
    }
    if (isLoginTaken) {
      setFormErrors({ login: "Имя пользователя уже занято" })
      return
    }
    setFormErrors({})
    const { passwordConfirm, ...data } = formData
    onStepComplete(data)
  }, [isSuccess])
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsedData = Step1Schema.safeParse(Object.fromEntries(formData))
    if (!parsedData.success) {
      setFormErrors(
        Object.fromEntries(
          Object.entries(z.treeifyError(parsedData.error).properties ?? {}).map(([key, value]) => [
            key,
            value?.errors?.join(", "),
          ]),
        ),
      )
      return
    }
    setFormData(parsedData.data)
    checkLogin({ login: parsedData.data.login })
  }
  return (
    <>
      <Form className={formCardClass} onSubmit={handleSubmit} errors={formErrors}>
        <Field.Root name="login" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Имя пользователя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="text" placeholder="ВашЛогин" className={inputClass} />
        </Field.Root>
        <Field.Root name="password" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Пароль</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="password" placeholder="admin" className={inputClass} />
        </Field.Root>
        <Field.Root name="passwordConfirm" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>И его же ещё разок</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="password" placeholder="admin" className={inputClass} />
        </Field.Root>
        <Button className={`${actionButtonClass} text-lg uppercase md:text-xl`} type="submit" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "ДАЛЕЕ >"}
        </Button>
      </Form>
      <p className="text-text-main text-center">
        Уже есть аккаунт?{" "}
        <Link className="text-accent-primary font-medium hover:underline" href="/login">
          Войдите
        </Link>
      </p>
    </>
  )
}

const Step2Schema = z.object({
  email: z.email("Заполните корректный email"),
  usersFirstName: z.string().nonempty("Имя не может быть пустым"),
  usersSecondName: z.string().nonempty("Фамилия не может быть пустой"),
  usersThirdName: z.string().optional(),
  usersBirthday: z
    .date("Выберите дату своего рождения")
    .refine((date) => date && calculateAge(date) >= 5, "Вам должно исполниться хотя бы 5 лет")
    .refine((date) => date && calculateAge(date) <= 200, "Вам должно исполниться не более 200 лет"),
  isAcceptedPolicy: z.literal("on", "Вы должны согласиться с политикой конфиденциальности"),
})

type Step2Interface = Omit<z.infer<typeof Step2Schema>, "isAcceptedPolicy" | "usersBirthday"> & {
  usersBirthday: number
}

function Step2({ onStepComplete }: { onStepComplete: (data: Step2Interface) => void }) {
  const [formErrors, setFormErrors] = useState({})
  const [birthDate, setBirthDate] = useState<Date | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsedData = Step2Schema.safeParse({ ...Object.fromEntries(formData), usersBirthday: birthDate })
    if (!parsedData.success) {
      setFormErrors(
        Object.fromEntries(
          Object.entries(z.treeifyError(parsedData.error).properties ?? {}).map(([key, value]) => [
            key,
            value?.errors?.join(", "),
          ]),
        ),
      )
      return
    }
    setFormErrors({})
    const { isAcceptedPolicy, ...data } = parsedData.data
    onStepComplete({ ...data, usersBirthday: birthDate!!.getTime() })
  }

  return (
    <Form className={formCardClass} onSubmit={handleSubmit} errors={formErrors}>
      <div className={inlineGridClass}>
        <Field.Root name="usersFirstName" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Имя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="text" placeholder="Иванов" className={inputClass} />
        </Field.Root>
        <Field.Root name="usersSecondName" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Фамилия</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="text" placeholder="Иванов" className={inputClass} />
        </Field.Root>
      </div>
      <Field.Root name="usersThirdName" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Отчество (При наличии)</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError" />
        <Field.Control type="text" placeholder="Иванович" className={inputClass} />
      </Field.Root>
      <Field.Root name="email" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Email</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError" />
        <Field.Control type="text" placeholder="email@example.xyz" className={inputClass} />
      </Field.Root>
      <Field.Root name="usersBirthday" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Дата Рождения</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError" />
        <DatePicker
          type="single"
          className={datePickerClass}
          onPick={(date) => {
            setBirthDate(date)
          }}
          captionLayout="dropdown"
        />
      </Field.Root>
      <Field.Root name="isAcceptedPolicy" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError" />
        <div className={policyCardClass}>
          <p>
            Я соглашаюсь с{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href={FILES_SERVER + "Privacy Policy.pdf"}
            >
              Политикой Конфиденциальности
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="flex text-bg-alt transition data-unchecked:hidden">
                <CheckIcon className="size-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      {/*TODO: Insert correct link on privsacy policy*/}
      <Button className={`${actionButtonClass} text-lg uppercase md:text-xl`} type="submit">
        ДАЛЕЕ {">"}
      </Button>
    </Form>
  )
}

const Step3Schema = z.object({
  parentFirstName: z.string().nonempty("Имя не может быть пустым"),
  parentSecondName: z.string().nonempty("Фамилия не может быть пустой"),
  parentThirdName: z.string().optional(),
  parentBirthday: z
    .date("Выберите дату рождения родителя")
    .refine((date) => date && calculateAge(date) >= 18, "Родителю должно исполниться хотя бы 18 лет")
    .refine((date) => date && calculateAge(date) <= 200, "Родителю должно исполниться не более 200 лет"),
  parentContact: z.string().nonempty("Необходимо указать контактный номер"),
  isAcceptedPolicy: z.literal("on", "Вы должны согласиться с политикой конфиденциальности"),
})

type Step3Interface = Omit<z.infer<typeof Step3Schema>, "parentBirthday"> & {
  parentBirthday: number
}

function Step3({ onStepComplete }: { onStepComplete: (data: Step3Interface) => void }) {
  const [formErrors, setFormErrors] = useState({})
  const [birthDate, setBirthDate] = useState<Date | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsedData = Step3Schema.safeParse({ ...Object.fromEntries(formData), parentBirthday: birthDate })
    if (!parsedData.success) {
      setFormErrors(
        Object.fromEntries(
          Object.entries(z.treeifyError(parsedData.error).properties ?? {}).map(([key, value]) => [
            key,
            value?.errors?.join(", "),
          ]),
        ),
      )
      return
    }
    setFormErrors({})
    onStepComplete({ ...parsedData.data, parentBirthday: birthDate!!.getTime() })
  }

  return (
    <Form className={formCardClass} onSubmit={handleSubmit} errors={formErrors}>
      <div className={inlineGridClass}>
        <Field.Root name="parentFirstName" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Имя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="text" placeholder="Антон" className={inputClass} />
        </Field.Root>
        <Field.Root name="parentSecondName" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Фамилия</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError" />
          <Field.Control type="text" placeholder="Фоломин" className={inputClass} />
        </Field.Root>
      </div>
      <Field.Root name="parentThirdName" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Отчество</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError" />
        <Field.Control type="text" placeholder="Отчество (при наличии)" className={inputClass} />
      </Field.Root>
      <Field.Root name="parentContact" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Контактный номер</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError" />
        <Field.Control type="text" placeholder="+79999999999" className={inputClass} />
      </Field.Root>
      <Field.Root name="parentBirthday" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Дата Рождения</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError" />
        <DatePicker
          type="single"
          className={datePickerClass}
          onPick={(date) => {
            setBirthDate(date)
          }}
          captionLayout="dropdown"
        />
      </Field.Root>
      <Field.Root name="isAcceptedPolicy" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError" />
        <div className={policyCardClass}>
          <p>
            Я соглашаюсь с{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href={FILES_SERVER + "Privacy Policy.pdf"}
            >
              Политикой Конфиденциальности
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="flex text-bg-alt transition data-unchecked:hidden">
                <CheckIcon className="size-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      {/*TODO: Insert correct link on privsacy policy*/}
      <Button className={`${actionButtonClass} text-lg uppercase md:text-xl`} type="submit">
        ДАЛЕЕ {">"}
      </Button>
    </Form>
  )
}

function calculateAge(birthday: Date) {
  var ageDifMs = Date.now() - birthday.getTime()
  var ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}