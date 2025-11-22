"use client"

import { Forms } from "@/components/forms"
import { DatePickerField } from "@/components/forms/fields/DatePickerField"
import { ErrorTooltip } from "@/components/forms/ui/ErrorTooltip"
import LoginLayout from "@/components/login/mainLayout"
import DatePicker from "@/components/pickers/DatePicker"
import { Button } from "@/components/ui/Buttons"
import { Checkbox, Field, Form } from "@base-ui-components/react"
import { FormEvent, useRef, useState } from "react"

export default function Page() {
  const [displayedStep, setDisplayedStep] = useState(2)

  let displayForm = <></>
  let displayedTitle = ""
  let displayedDescription = ""
  switch (displayedStep) {
    case 1:
      displayForm = (
        <Step1
          onStepComplete={() => {
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
          onStepComplete={(isUnderaged) => {
            if (isUnderaged) {
              setDisplayedStep(3)
              return
            }
            // TODO: Write redirect logic
          }}
        ></Step2>
      )
      displayedTitle = "РАССКАЖИТЕ О СЕБЕ"
      displayedDescription = "Расскажите нам о себе, чтобы мы могли рекомендовать вам подходящие мероприятия."
      break
    case 3:
      displayForm = <></>
      displayedTitle = "НЕБОЛЬШАЯ ФОРМАЛЬНОСТЬ"
      displayedDescription =
        "Вам не исполнилось 18-ти лет и вы не можете предоставить согласие на обработку Ваших персональных данных, поэтому за Вас это должен сделать Ваш законный представитель. Для этого ему нужно будет заполнить эту форму и подтвердить согласие самостоятельно."
      break
  }

  return (
    <LoginLayout title={displayedTitle} description={displayedDescription}>
      {displayForm}
    </LoginLayout>
  )
}

function Step1({ onStepComplete }: { onStepComplete: () => void }) {
  const [formErrors, setFormErrors] = useState({})
  const formRef = useRef<HTMLFormElement>(null)

  // ---------TMP----------
  const [isLoading, setIsLoading] = useState(false)
  // ----------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newFormErrors: { email?: string; username?: string; password?: string; passwordConfirm?: string } = {}
    const email = formData.get("email")
    if (email === "") newFormErrors.email = "Email не может быть пустым"
    const username = formData.get("username")
    if (username === "") newFormErrors.username = "Имя пользовыателя не может быть пустым"
    const password = formData.get("password")
    if (password === "") newFormErrors.password = "Пароль не можетр быть пустым"
    const passwordconf = formData.get("passwordConfirm")
    if (password !== passwordconf) newFormErrors.passwordConfirm = "Введённый второй раз пароль не совпадает"
    if (newFormErrors.email || newFormErrors.password || newFormErrors.passwordConfirm) {
      setFormErrors(newFormErrors)
      return
    }
    // ---------TMP--------------
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    setIsLoading(false)
    // --------------------------
    onStepComplete()
  }
  return (
    <Form className="flex w-full flex-col items-center gap-5" onSubmit={handleSubmit} ref={formRef} errors={formErrors}>
      <Field.Root name="email" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Email</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="email@example.xyz"
          className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Root>
      <Field.Root name="username" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Имя пользователя</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="ВашНик"
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
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "ЗАГРУЗКА..." : "ДАЛЕЕ>"}
      </Button>
    </Form>
  )
}

function Step2({ onStepComplete }: { onStepComplete: (isUnderaged: boolean) => void }) {
  const [formErrors, setFormErrors] = useState({})
  const formRef = useRef<HTMLFormElement>(null)
  const [birthDate, setBirthDate] = useState<Date>(null)
  const [isAcceptedPolicy, setIsAcceptedPolicy] = useState(false)

  // ---------TMP----------
  const [isLoading, setIsLoading] = useState(false)
  // ----------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newFormErrors: { name?: string; surname?: string; date?: string } = {}
    const name = formData.get("name")
    if (name === "") newFormErrors.name = "Имя не может быть пустым"
    const surname = formData.get("surname")
    if (surname === "") newFormErrors.surname = "Фамилия не может быть пустой"
    if (!birthDate) newFormErrors.date = "Необходимо выбрать дату рождения"
    if (birthDate && calculateAge(birthDate) < 10) newFormErrors.date = "Вы слишком молоды для этого дерьма..." // TODO: Add error for critical underage
    if (newFormErrors.name || newFormErrors.surname || newFormErrors.date) {
      setFormErrors(newFormErrors)
      return
    }
    // ---------TMP--------------
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // --------------------------
    birthDate && onStepComplete(calculateAge(birthDate) < 18)
  }

  return (
    <Form className="flex w-full flex-col items-center gap-5" onSubmit={handleSubmit} ref={formRef} errors={formErrors}>
      <div className="flex w-full flex-row justify-between gap-5">
        <Field.Root name="firstname" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Имя</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="Антон"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
        <Field.Root name="secondname" className="flex w-full flex-col items-start gap-1">
          <Field.Label className="text-lg font-medium text-gray-900">Фамилия</Field.Label>
          <Field.Error className="text-md text-red-800" match="customError" />
          <Field.Control
            type="text"
            placeholder="Фоломин"
            className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
          />
        </Field.Root>
      </div>
      <Field.Root name="patronymic" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Отчество</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />
        <Field.Control
          type="text"
          placeholder="Отчество (при наличии)"
          className="border-border h-15 w-full rounded-xl border pl-3.5 text-xl text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
      </Field.Root>
      <Field.Root name="date" className="flex w-full flex-col items-start gap-1">
        <Field.Label className="text-lg font-medium text-gray-900">Дата Рождения</Field.Label>
        <Field.Error className="text-md text-red-800" match="customError" />

        {/*<DatePicker
            type="single"
            className="w-full h-10 px-2 rounded-md border border-border bg-bg-main-accent flex justify-between items-center"
            onPick={(date) => {
              setBirthDate(date)
            }}
          />*/}
      </Field.Root>
      {/*TODO: Style date picxker and error display*/}
      <label className="text-md border-border flex w-full items-start justify-between gap-2 rounded-xl border p-4 text-gray-900 select-none">
        <p>
          Я соглашаюсь с{" "}
          <a className="text-accent-primary underline" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            Политикой Конфиденциальности
          </a>
        </p>
        <Checkbox.Root
          disabled={!birthDate || calculateAge(birthDate) < 18}
          className="flex size-5 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
        >
          <Checkbox.Indicator className="flex text-gray-50 data-unchecked:hidden">
            <CheckIcon className="size-3" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </label>
      {/*TODO: Insert correct link on privsacy policy*/}
      <Button
        className="bg-accent-primary-alt border-accent-primary text-accent-primary h-15 w-full rounded-xl border-2 text-2xl font-bold"
        disabled={isLoading || (!isAcceptedPolicy && birthDate && calculateAge(birthDate) >= 18)}
        type="submit"
      >
        {isLoading ? "ЗАГРУЗКА..." : "ДАЛЕЕ>"}
      </Button>
    </Form>
  )
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}
function calculateAge(birthday: Date) {
  var ageDifMs = Date.now() - birthday.getTime()
  var ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
