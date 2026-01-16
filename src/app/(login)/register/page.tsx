"use client"
import {useIsEmailTakenMutation, useIsLoginTakenMutation, useRegisterMutation} from "@/api/auth/clientApiInterface"
import LoginLayout from "@/components/login/mainLayout"
import DatePicker from "@/components/pickers/DatePicker"
import {Button} from "@/components/ui/Buttons"
import {FILES_SERVER} from "@/constants/APIEndpoints"
import {AUTH_TOKEN_KEY_NAME} from "@/constants/CookieKeys"
import {Checkbox, Field, Form} from "@base-ui-components/react"
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import cookies from "js-cookie"
import Link from "next/link"
import {redirect, useRouter} from "next/navigation"
import {FormEvent, useCallback, useEffect, useRef, useState} from "react"
import {z} from "zod"
import twclsx from "@/utils/twClassMerge"
import {usersApiClient, useUsersDispatch, useVerifyEmailQuery} from "@/api/users/clientApiInterface"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
// import {closeSocket} from "@/api/users/configuration"
import {useDispatch} from "react-redux"
import Loading from "@/app/loading"
import {IoIosCheckmarkCircle} from "react-icons/io"
import {UsersApiContext} from "@/api/users/clientApiInterface"

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
  "h-15 w-full rounded-xl border border-border bg-bg-alt px-4 text-lg text-text-main transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main"
const actionButtonClass =
  "bg-accent-primary-alt border border-accent-primary text-accent-primary h-15 w-full rounded-xl font-semibold tracking-wide transition duration-200 outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main disabled:cursor-not-allowed disabled:opacity-70"
const inlineGridClass = "grid w-full gap-6 md:gap-[2%] md:grid-cols-[46%_52%]"
const datePickerClass =
  "outline-none flex h-15 w-full items-center justify-between rounded-xl border border-border bg-bg-alt px-4 text-lg text-text-main transition duration-200 focus-within:ring-2 focus-within:ring-accent-primary focus-within:ring-offset-2 focus-within:ring-offset-bg-main"
const policyCardClass =
  "flex w-full h-15 flex-row items-center gap-3 rounded-xl border border-border bg-bg-alt p-4 text-sm leading-relaxed text-text-main sm:flex-row sm:items-center sm:justify-between sm:gap-4 select-none"
const checkboxRootClass =
  "flex size-5 items-center justify-center rounded-md border border-border bg-bg-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main data-checked:border-transparent data-checked:bg-text-main"

export default function Page() {
  const [displayedStep, setDisplayedStep] = useState(1)
  const [formData, setFormData] = useState<RegisterFormData>({})
  const [register, {data, isLoading, error, isSuccess}] = useRegisterMutation()
  const router = useRouter()
  const handleRegister = useCallback(
    (addData?: RegisterFormData) => {
      const fd = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value as string)
      })
      Object.entries(addData ?? {}).forEach(([key, value]) => {
        fd.append(key, value)
      })
      console.log("fd", fd)
      register({formData: fd})
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
            setFormData((prev) => ({...prev, ...data}))
            setDisplayedStep(2)
          }}
          filledData={formData}
        ></Step1>
      )
      displayedTitle = "СОЗДАЙТЕ АККАУНТ"
      displayedDescription = "Создайте аккаунт, чтобы получить доступ к функциям менеджера турнирной информации"
      break
    case 2:
      displayForm = (
        <Step2
          onStepComplete={(data) => {
            console.log("2---", data)
            setFormData((prev) => ({...prev, ...data}))
            if (calculateAge(new Date(data.usersBirthday!!)) < 14) setDisplayedStep(3)
            else {
              setDisplayedStep(4)
            }
          }}
          onBack={() => setDisplayedStep(1)}
          filledData={formData}
        ></Step2>
      )
      displayedTitle = "РАССКАЖИТЕ О СЕБЕ"
      displayedDescription = "Расскажите нам о себе, чтобы мы могли рекомендовать вам подходящие мероприятия"
      break
    case 3:
      displayForm = (
        <Step3
          onStepComplete={(data) => {
            console.log("3---", data)
            setFormData((prev) => ({...prev, ...data}))
            setDisplayedStep(4)
            // handleRegister(data)
          }}
          onBack={() => setDisplayedStep(2)}
          filledData={formData}
        ></Step3>
      )
      displayedTitle = "НЕБОЛЬШАЯ ЗАМИНКА"
      displayedDescription =
        "Вам не исполнилось 14 лет, поэтому для регистрации необходимо, чтобы согласие на обработку персональных данных дал Ваш законный представитель"
      break
    case 4:
      displayForm = (
        <UsersProviderWrapper>
          <VerificationStep
            onStepComplete={() => {
              setDisplayedStep(5)
              handleRegister()
            }}
            filledData={formData}
          ></VerificationStep>
        </UsersProviderWrapper>
      )
      displayedTitle = "ПОДТВЕРДИТЕ EMAIL"
      displayedDescription = "Подтвердите ваш email, чтобы..."
      // TODO: Rewrite description so it handles both cases verification of participant email and both participant and parent emails
      break
    case 5:
      // closeSocket()
      displayForm = (
        <Button
          disabled={isLoading}
          className={twclsx(actionButtonClass, "text-xl md:text-2xl")}
          onClick={() => {
            if (error) {
              handleRegister()
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

function Step1({
                 onStepComplete,
                 filledData,
               }: {
  onStepComplete: (data: Step1Interface) => void
  filledData: RegisterFormData
}) {
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState<z.infer<typeof Step1Schema> | null>(null)

  const [checkLogin, {data: isLoginTaken, isLoading, error, isSuccess}] = useIsLoginTakenMutation()

  useEffect(() => {
    if (!formData || isLoading) return
    if (!isSuccess) {
      setFormErrors({login: "Не удалось проверить свободность имени пользователя"})
      console.error("Error checking login availability", error)
      return
    }
    if (isLoginTaken) {
      setFormErrors({login: "Имя пользователя уже занято"})
      return
    }
    setFormErrors({})
    const {passwordConfirm, ...data} = formData
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
    checkLogin({login: parsedData.data.login})
  }

  return (
    <>
      <Form className={formCardClass} onSubmit={handleSubmit} errors={formErrors}>
        <Field.Root name="login" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Имя пользователя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control type="text" placeholder="ВашНик" className={inputClass} defaultValue={filledData.login}/>
        </Field.Root>
        <Field.Root name="password" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Пароль</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control
            type="password"
            placeholder="ИмяВашегоКота"
            className={inputClass}
            defaultValue={filledData.password}
          />
        </Field.Root>
        <Field.Root name="passwordConfirm" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Повторите пароль</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control
            type="password"
            placeholder="ИмяВашегоКота"
            className={inputClass}
            defaultValue={filledData.password}
          />
        </Field.Root>
        <Button
          className={twclsx(actionButtonClass, "text-lg uppercase md:text-xl")}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "ДАЛЕЕ"}
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
  isConsentedToDataTransfer: z.literal("on", "Вы должны дать согласие на обработку персональных данных"),
})

type Step2Interface = Omit<
  z.infer<typeof Step2Schema>,
  "isAcceptedPolicy" | "isConsentedToDataTransfer" | "usersBirthday"
> & {
  usersBirthday: number
}

function Step2({
                 onStepComplete,
                 onBack,
                 filledData,
               }: {
  onStepComplete: (data: Step2Interface) => void
  onBack: () => void
  filledData: RegisterFormData
}) {
  const [formData, setFormData] = useState<z.infer<typeof Step2Schema> | null>(null)
  const [formErrors, setFormErrors] = useState({})
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [checkEmailAvailability, {data: isEmailTaken, isLoading, error, isSuccess}] = useIsEmailTakenMutation()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsedData = Step2Schema.safeParse({...Object.fromEntries(formData), usersBirthday: birthDate})
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
    checkEmailAvailability({email: parsedData.data.email})
  }

  useEffect(() => {
    filledData.usersBirthday && setBirthDate(new Date(filledData.usersBirthday))
  }, [])

  useEffect(() => {
    if (!formData || isLoading) return
    if (!isSuccess) {
      setFormErrors({email: "Не удалось проверить свободность email"})
      console.error("Error checking email availability", error)
      return
    }
    if (isEmailTaken) {
      setFormErrors({email: "Email уже занят"})
      return
    }
    setFormErrors({})
    const {isAcceptedPolicy, isConsentedToDataTransfer, usersBirthday, ...data} = formData
    onStepComplete({...data, usersBirthday: usersBirthday!!.getTime()})
  }, [isSuccess])

  return (
    <Form className={formCardClass} onSubmit={handleSubmit} errors={formErrors}>
      <div className={inlineGridClass}>
        <Field.Root name="usersFirstName" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Имя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control
            type="text"
            placeholder="Иванов"
            className={inputClass}
            defaultValue={filledData.usersFirstName}
          />
        </Field.Root>
        <Field.Root name="usersSecondName" className={fieldRootClass}>
          <Field.Label className={fieldLabelClass}>Фамилия</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control
            type="text"
            placeholder="Иванов"
            className={inputClass}
            defaultValue={filledData.usersSecondName}
          />
        </Field.Root>
      </div>
      <Field.Root name="usersThirdName" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Отчество (При наличии)</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <Field.Control
          type="text"
          placeholder="Иванович"
          className={inputClass}
          defaultValue={filledData.usersThirdName}
        />
      </Field.Root>
      <Field.Root name="email" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Email</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <Field.Control
          type="text"
          placeholder="email@example.xyz"
          className={inputClass}
          defaultValue={filledData.email}
        />
      </Field.Root>
      <Field.Root name="usersBirthday" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Дата Рождения</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <DatePicker
          type="single"
          className={datePickerClass}
          onPick={(date) => {
            setBirthDate(date)
          }}
          captionLayout="dropdown"
          defaultDate={filledData.usersBirthday ? new Date(filledData.usersBirthday) : undefined}
        />
      </Field.Root>
      <Field.Root name="isAcceptedPolicy" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <div className={policyCardClass}>
          <p>
            Я соглашаюсь с{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href={FILES_SERVER + "Privacy Policy.pdf"}
              target="_blank"
            >
              Политикой Конфиденциальности
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="text-bg-alt flex transition data-unchecked:hidden">
                <CheckIcon className="size-3"/>
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>

      <Field.Root name="isConsentedToDataTransfer" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <div className={policyCardClass}>
          <p>
            Я даю согласие на{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href={FILES_SERVER + "Personal Data Transfer Agreement.pdf"}
              target="_blank"
            >
              Обработку персональных данных
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="text-bg-alt flex transition data-unchecked:hidden">
                <CheckIcon className="size-3"/>
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      <div className="flex w-full gap-4">
        <Button
          className={twclsx(actionButtonClass, "text-lg uppercase md:text-xl")}
          type="button"
          onClick={onBack}
          disabled={isLoading}
        >
          НАЗАД
        </Button>
        <Button
          className={twclsx(actionButtonClass, "text-lg uppercase md:text-xl")}
          type="submit"
          disabled={isLoading}
        >
          ДАЛЕЕ
        </Button>
      </div>
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
  parentContact: z.email("Необходимо указать контактную почту"),
  isAcceptedPolicy: z.literal("on", "Вы должны согласиться с политикой конфиденциальности"),
  isConsentedToDataTransfer: z.literal("on", "Вы должны дать согласие на обработку персональных данных"),
})

type Step3Interface = Omit<
  z.infer<typeof Step3Schema>,
  "parentBirthday" | "isAcceptedPolicy" | "isConsentedToDataTransfer"
> & {
  parentBirthday: number
}

function Step3({
                 onStepComplete,
                 onBack,
                 filledData,
               }: {
  onStepComplete: (data: Step3Interface) => void
  onBack: () => void
  filledData: RegisterFormData
}) {
  const [formErrors, setFormErrors] = useState({})
  const [birthDate, setBirthDate] = useState<Date | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsedData = Step3Schema.safeParse({...Object.fromEntries(formData), parentBirthday: birthDate})
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
    const {isAcceptedPolicy, isConsentedToDataTransfer, ...data} = parsedData.data
    onStepComplete({...data, parentBirthday: birthDate!!.getTime()})
  }

  return (
    <Form className={formCardClass} onSubmit={handleSubmit} errors={formErrors}>
      <div className={inlineGridClass}>
        <Field.Root name="parentFirstName" className={twclsx(fieldRootClass)}>
          <Field.Label className={fieldLabelClass}>Имя законного представителя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control
            type="text"
            placeholder="Иван"
            className={inputClass}
            defaultValue={filledData.parentFirstName}
          />
        </Field.Root>
        <Field.Root name="parentSecondName" className={twclsx(fieldRootClass)}>
          <Field.Label className={fieldLabelClass}>Фамилия законного представителя</Field.Label>
          <Field.Error className={fieldErrorClass} match="customError"/>
          <Field.Control
            type="text"
            placeholder="Иванов"
            className={inputClass}
            defaultValue={filledData.parentSecondName}
          />
        </Field.Root>
      </div>
      <Field.Root name="parentThirdName" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Отчество законного представителя</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <Field.Control
          type="text"
          placeholder="Иванович"
          className={inputClass}
          defaultValue={filledData.parentThirdName}
        />
      </Field.Root>
      <Field.Root name="parentContact" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Контактная почта законного представителя</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <Field.Control
          type="text"
          placeholder="email@example.xyz"
          className={inputClass}
          defaultValue={filledData.parentContact}
        />
      </Field.Root>
      <Field.Root name="parentBirthday" className={fieldRootClass}>
        <Field.Label className={fieldLabelClass}>Дата рождения законного представителя</Field.Label>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <DatePicker
          type="single"
          className={datePickerClass}
          onPick={(date) => {
            setBirthDate(date)
          }}
          captionLayout="dropdown"
          defaultDate={filledData.parentBirthday ? new Date(filledData.parentBirthday) : undefined}
        />
      </Field.Root>
      <Field.Root name="isAcceptedPolicy" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <div className={policyCardClass}>
          <p>
            Я(законный представитель) соглашаюсь с{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href={FILES_SERVER + "Privacy Policy.pdf"}
              target="_blank"
            >
              Политикой Конфиденциальности
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="text-bg-alt flex transition data-unchecked:hidden">
                <CheckIcon className="size-3"/>
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      <Field.Root name="isConsentedToDataTransfer" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError"/>
        <div className={policyCardClass}>
          <p>
            Я(законный представитель) даю согласие на{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href={FILES_SERVER + "Personal Data Transfer Agreement.pdf"}
              target="_blank"
            >
              Обработку персональных данных
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="text-bg-alt flex transition data-unchecked:hidden">
                <CheckIcon className="size-3"/>
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      <div className="flex w-full gap-4">
        <Button className={twclsx(actionButtonClass, "text-lg uppercase md:text-xl")} type="button" onClick={onBack}>
          НАЗАД
        </Button>
        <Button className={twclsx(actionButtonClass, "text-lg uppercase md:text-xl")} type="submit">
          ДАЛЕЕ
        </Button>
      </div>
    </Form>
  )
}

function VerificationStep({
                            onStepComplete,
                            filledData,
                          }: {
  onStepComplete: () => void
  filledData: RegisterFormData
}) {
  // const waitTime = 1
  // const [emailVerificationStatus, setEmailVerificationStatus] = useState<{ [key: string]: number }>()

  const [emails, setEmails] = useState<{ [key: string]: number }>(
  //   {
  //   "antonivanov@mtiyt.ru": 0,
  //   "test1@mtiyt.ru": 0,
  // }
    () =>
    {
      const status: { [key: string]: number } = {}
      if (filledData.email) {
        status[filledData.email] = 0
      }
      if (filledData.parentContact) {
        status[filledData.parentContact] = 0
      }
      return status
    }
  )
  const emailsList = Object.keys(emails)
  const emailsToVerify = emailsList.filter((email) => emails[email] === 0)
  const nextEmailToConfirm = emailsToVerify.length !== 0 ? emailsToVerify[0] : emailsList[emailsList.length - 1]
  const [allMessages, setAllMessages] = useState("")
  const {
    data: verifyEmail,
    isLoading: isVerifyLoading,
    error: verifyError,
    isSuccess: isVerifySuccess,
  } = useVerifyEmailQuery({email: nextEmailToConfirm})
  useEffect(() => {
    if (!verifyEmail){
      console.log("Empty state from socket")
    }
    else if (verifyEmail.startsWith("registered")){
      console.log("Session opened")
    }
    else if (verifyEmail.startsWith("ok")) {
      const email = verifyEmail.split(" ")[1]
      const newEmails = {...emails}
      newEmails[email] = 1
      setEmails(newEmails)
    }
    else if(emailsList.find((e) => e === verifyEmail)){
      const email = verifyEmail
      const newEmails = {...emails}
      newEmails[email] = 2
      setEmails(newEmails)
    }
    else{
      console.log("Unknown message " + verifyEmail)
    }

    setAllMessages(prev => prev + " | " + verifyEmail)
  }, [verifyEmail])

  // const dispatch = useUsersDispatch()
  // const [timeRemaining, setTimeRemaining] = useState(waitTime)
  // const unverifiedList = Object.keys(emailVerificationStatus).filter((email) => emailVerificationStatus[email] === 0)
  // const emailOnVerify = "antonivanov@mtiyt.ru"
  // unverifiedList[0] +


  // const {
  //   data: verifyEmail,
  //   isLoading: isVerifyLoading,
  //   error: verifyError,
  //   isSuccess: isVerifySuccess,
  // } = useVerifyEmailQuery({email: emailOnVerify})

  // useEffect(() => {
  //   if (timeRemaining <= 0) return

  //   const timer = setInterval(() => {
  //     setTimeRemaining((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer)
  //         return 0
  //       }
  //       return prev - 1
  //     })
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [timeRemaining])

  // useEffect(() => {
  //   console.log("isVerifySuccess", isVerifySuccess)
  //   console.log("verifyEmail", verifyEmail)
  //   console.log("emailOnVerify", emailOnVerify)
  //   if (!isVerifySuccess || isVerifyLoading) return
  //   if (verifyEmail === "ok") {
  //     setEmailVerificationStatus((prev) => {
  //       if (!emailOnVerify) return prev
  //       const newStatus = {...prev}
  //       newStatus[emailOnVerify] = 1
  //       return newStatus
  //     })
  //     return
  //   }
  //   if (!verifyEmail) return
  //   setEmailVerificationStatus((prev) => {
  //     const newStatus = {...prev}
  //     newStatus[verifyEmail] = 2
  //     return newStatus
  //   })
  // }, [verifyEmail])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={formCardClass}>
      <div className="flex flex-col gap-4">
        {Object.entries(emails).map(([email, status]) => (
          <div
            className="text-text-main border-border flex flex-col items-center gap-2 rounded-2xl border px-2 py-5"
            key={email}
          >
            <p>{email}:</p>
            {/* TOFO: Add a button to resend the verification email and add colors in the p below based on the status */}

            {status === 0 ? (
              <div>
                <Loading/>
                <p>Отправляем сообщение</p>
              </div>
            ) : status === 1 ? (
              <div>
                <Loading/>
                <p>Ожидаем подтверждения</p>
              </div>
            ) : (
              <div>
                <IoIosCheckmarkCircle className="w-full text-5xl text-green-500"/>
                <p>Подтверждено</p>
              </div>
            )}
          </div>
        ))}

        {/* <div className="text-text-main flex items-center justify-center gap-2 text-lg font-semibold">
          {timeRemaining > 0 ? (
            <>
              <span>Не пришло письмо? Отправить ещё одно через:</span>
              <span className="text-accent-primary">{formatTime(timeRemaining)}</span>
            </>
          ) : (
            <span
              className="text-accent-primary cursor-pointer"
              onClick={() => {
                closeSocket().then(() => {
                  setTimeRemaining(waitTime)
                  setEmailVerificationStatus((prev) => {
                    const newStatuses = { ...prev }
                    Object.keys(newStatuses).forEach((email) => {
                      newStatuses[email] = 0
                    })
                    return newStatuses
                  })
                })
              }}
            >
              Отправить ещё одно письмо
            </span>
          )}
        </div> */}
        {/* TODO: Make retry send button (commented code not working) */}
      </div>
      <Button
        className={twclsx(actionButtonClass, "text-lg uppercase md:text-xl")}
        onClick={onStepComplete}
        disabled={Object.values(emails).some((status) => status !== 2)}
      >
        ДАЛЕЕ
      </Button>
    </div>
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
      <path
        d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z"/>
    </svg>
  )
}
