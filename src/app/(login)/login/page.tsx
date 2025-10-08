"use client"
import style from "@/styles/routes/(login)/login.module.css"
import {useState, FormEvent, useRef, Suspense, useEffect} from "react"
import {AUTH_API} from "@/constants/APIEndpoints"
import {useRouter, useSearchParams} from "next/navigation"
import {FaEye, FaEyeSlash} from "react-icons/fa6"
import {IconInput, TitledInput} from "@/components/ui/Input"
import Loading from "@/app/loading"
import cookies from "js-cookie"
import {AUTH_TOKEN_KEY_NAME} from "@/constants/CookieKeys"
import {Button} from "@/components/ui/Buttons"
import LogoWithTT from "@/components/ui/LogoWithTT"
import {setAuth, setToken} from "@/redux_stores/Global/AuthSlice"
import {useAppDispatch} from "@/redux_stores/Global/tournamentTypeRedixStore"
import footerStyle from "@/styles/components/sections/app/footer.module.css"
import AuthProviderWrapper from "@/api/auth/ClientWrapper";
import {useLoginMutation} from "@/api/auth/clientApiInterface";

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
            <AuthProviderWrapper>
                <Suspense fallback={<Loading/>}>
                    <LoginPage/>
                </Suspense>
            </AuthProviderWrapper>

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

    const [login, {
        data,        // Ответ от сервера
        error,       // Объект ошибки
        isLoading,   // Запрос выполняется
        isSuccess,   // Запрос успешно завершен
        isError,     // Запрос завершился ошибкой
        isUninitialized, // Запрос еще не вызывался
        reset,       // Сбросить состояние
        originalArgs, // Аргументы последнего вызова
        requestId,   // ID запроса
    }] = useLoginMutation()

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
        // const token = await fetchSendLogin(formData)
        login({formData: formData})
        // if (token === null) {
        //     setFormState(FormState.UnknownError)
        //     return
        // }
        // if (!token) {
        //     setFormState(FormState.IncorrectData)
        //     return
        // }
        // dispatcher(setToken(token))
        // cookies.set(AUTH_TOKEN_KEY_NAME, token)
        // router.replace("/" + redirect)
    }
    useEffect(() => {
        if (error){
            setFormState(FormState.IncorrectData)
        }

    }, [error])
    useEffect(() => {
        if (isSuccess && data){
            dispatcher(setToken(data))
            cookies.set(AUTH_TOKEN_KEY_NAME, data)
            router.replace("/" + redirect)
        }
    }, [isSuccess]);

    function handleEnter() {
        if (!formRef.current) return
        handleLogin(formRef.current)
    }

    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="flex flex-col justify-center items-center gap-1 bg-bg-alt rounded-4xl py-14 w-[40rem] px-[4rem]">
                    <div className="flex flex-col gap-0">
                        <h2 className="text-[4rem] font-bold leading-1">МТИ</h2>
                        <h2 className="text-[4rem] font-bold">ТЮФ</h2>
                    </div>

                    <div className="flex flex-col gap-1 border border-border py-5 rounded-2xl">
                        <h2 className="text-center font-bold text-text-main text-4xl">ВОЙТИ В АККАУНТ</h2>
                        <p className="text-text-alt font-medium text-center text-lg">Войдите в аккаунт, чтобы получить доступ к функциям
                            организаторов</p>
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
                            <PasswordField onEnter={handleEnter} disabled={formState === FormState.Loading}/>
                        </TitledInput>
                        <Button type="submit" className={style.loginButton} disabled={formState === FormState.Loading}>
                            {formState === FormState.Loading ? "ЗАГРУЗКА..." : "ВОЙТИ"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>

    )
}

function PasswordField({onEnter, disabled}: { onEnter: (el: HTMLInputElement) => void; disabled: boolean }) {
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
