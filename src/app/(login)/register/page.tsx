"use client"
import LoginLayout from "@/components/login/mainLayout"
import DatePicker from "@/components/pickers/DatePicker"
import { Button } from "@/components/ui/Buttons"
import Modal from "@/components/ui/Modals"
import { Checkbox, Field, Form } from "@base-ui-components/react"
import { redirect } from "next/navigation"
import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { PiWarningBold } from "react-icons/pi"
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

export default function Page() {
  const [displayedStep, setDisplayedStep] = useState(1)
  const [formData, setFormData] = useState<RegisterFormData>({})
  // -----------TMP---------------
  const [isLoading, setIsLoading] = useState(false)
  // TODO: Write RTK query for registration
  async function handleRegister() {
    // TODO: implement actual registration logic
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    setIsLoading(false)
  }
  // ------------------------------

  let displayForm = <></>
  let displayedTitle = ""
  let displayedDescription = ""
  switch (displayedStep) {
    case 1:
      displayForm = (
        <Step1
          onStepComplete={(data) => {
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
            setFormData((prev) => ({ ...prev, ...data }))
            if (calculateAge(new Date(data.usersBirthday!!)) < 14) setDisplayedStep(3)
            else {
              setDisplayedStep(4)
              handleRegister()
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
            setFormData((prev) => ({ ...prev, ...data }))
            setDisplayedStep(4)
            handleRegister()
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
          className="bg-accent-primary-alt border-accent-primary text-accent-primary h-15 w-full rounded-xl border-2 text-2xl font-bold"
          onClick={()=>{
            redirect("/")
          }}
        >
          {isLoading ? "Загрузка..." : "Ура, идём на главную"}
        </Button>
      )
      displayedTitle = isLoading ? "ПОЧТИ ГОТОВО..." : "ПОЗДРАВЛЯЕМ!"
      displayedDescription = isLoading
        ? "Мы собираем все данные и создаем для вас аккаунт. Это займет некоторое время."
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

  // TODO: Add RTK Query for checking username availability

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    setFormErrors({})
    onStepComplete(parsedData.data)
  }
  return (
    <>
      <Form className="flex w-full flex-col items-center gap-5" onSubmit={handleSubmit} errors={formErrors}>
        <Field.Root name="login" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Имя пользователя</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="ВашЛогин"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
        <Field.Root name="password" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Пароль</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="password"
            placeholder="admin"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
        <Field.Root name="passwordConfirm" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">И его же ещё разок</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="password"
            placeholder="admin"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
        <Button
          className="bg-accent-primary-alt border-accent-primary text-accent-primary h-15 w-full rounded-xl border-2 text-2xl font-bold"
          type="submit"
        >
          ДАЛЕЕ {">"}
        </Button>
      </Form>
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
    onStepComplete({ ...parsedData.data, usersBirthday: birthDate!!.getTime() })
  }

  return (
    <Form className="flex w-full flex-col items-center gap-5" onSubmit={handleSubmit} errors={formErrors}>
      <div className="flex w-full flex-row justify-between gap-5">
        <Field.Root name="usersFirstName" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Имя</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="Антон"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
        <Field.Root name="usersSecondName" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Фамилия</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="Фоломин"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
      </div>
      <Field.Root name="usersThirdName" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Отчество</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="Отчество (при наличии)"
          className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Root>
      <Field.Root name="email" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Email</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="email@example.xyz"
          className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Root>
      <Field.Root name="usersBirthday" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Дата Рождения</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <DatePicker
          type="single"
          className="border-border bg-bg-main-accent flex h-10 w-full items-center justify-between rounded-md border px-2"
          onPick={(date) => {
            setBirthDate(date)
          }}
          captionLayout="dropdown"
        />
      </Field.Root>
      {/*TODO: Style date picxker and error display*/}
      <Field.Root name="isAcceptedPolicy" className="flex w-full flex-col items-start gap-1">
        <Field.Error className="text-md text-red-800" match="customError" />
        <div className="text-md border-border flex w-full items-start justify-between gap-2 rounded-xl border p-4 text-gray-900 select-none">
          <p>
            Я соглашаюсь с{" "}
            <a className="text-accent-primary underline" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Политикой Конфиденциальности
            </a>
          </p>
          <Field.Item>
            <Checkbox.Root className="flex size-5 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300">
              <Checkbox.Indicator className="flex text-gray-50 data-unchecked:hidden">
                <CheckIcon className="size-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      {/*TODO: Insert correct link on privsacy policy*/}
      <Button
        className="bg-accent-primary-alt border-accent-primary text-accent-primary h-15 w-full rounded-xl border-2 text-2xl font-bold"
        type="submit"
      >
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
    <Form className="flex w-full flex-col items-center gap-5" onSubmit={handleSubmit} errors={formErrors}>
      <div className="flex w-full flex-row justify-between gap-5">
        <Field.Root name="parentFirstName" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Имя</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="Антон"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
        <Field.Root name="parentSecondName" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Фамилия</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="Фоломин"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
      </div>
      <Field.Root name="parentThirdName" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Отчество</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="Отчество (при наличии)"
          className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Root>
      <Field.Root name="parentContact" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Контактный номер</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="+79999999999"
          className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Root>
      <Field.Root name="parentBirthday" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Дата Рождения</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <DatePicker
          type="single"
          className="border-border bg-bg-main-accent flex h-10 w-full items-center justify-between rounded-md border px-2"
          onPick={(date) => {
            setBirthDate(date)
          }}
          captionLayout="dropdown"
        />
      </Field.Root>
      {/*TODO: Style date picxker and error display*/}
      <Field.Root name="isAcceptedPolicy" className="flex w-full flex-col items-start gap-1">
        <Field.Error className="text-md text-red-800" match="customError" />
        <div className="text-md border-border flex w-full items-start justify-between gap-2 rounded-xl border p-4 text-gray-900 select-none">
          <p>
            Я соглашаюсь с{" "}
            <a className="text-accent-primary underline" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Политикой Конфиденциальности
            </a>
          </p>
          <Field.Item>
            <Checkbox.Root className="flex size-5 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300">
              <Checkbox.Indicator className="flex text-gray-50 data-unchecked:hidden">
                <CheckIcon className="size-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
      {/*TODO: Insert correct link on privsacy policy*/}
      <Button
        className="bg-accent-primary-alt border-accent-primary text-accent-primary h-15 w-full rounded-xl border-2 text-2xl font-bold"
        type="submit"
      >
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
