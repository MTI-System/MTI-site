const isServer = typeof window === "undefined";

export const protocol = process.env.NEXT_PUBLIC_IS_ON_DEV === "true" ? `http` : `https`
export const webSocketProtocol = process.env.NEXT_PUBLIC_IS_ON_DEV === "true" ? `ws` : `wss`
export const GATEWAY_API =
  isServer ?
    process.env.NEXT_PUBLIC_IS_LOCAL === "true" ?
      process.env.NEXT_PUBLIC_IS_ON_DEV === "true" ?
        "://11.0.0.1:5002/"
        : "://api.mtiyt.ru/"
      : "://gateway:8080"
  : process.env.NEXT_PUBLIC_IS_ON_DEV === "true"
      ? "://11.0.0.1:5002/"
      : "://api.mtiyt.ru/"

  // process.env.NEXT_PUBLIC_IS_ON_DEV === "true" ? "://11.0.0.1:5002/" : "://api.mtiyt.ru/" // на сервере эта переменная всегда была ://gateway:8080/
export const AUTH_API = protocol + GATEWAY_API + "auth/"
export const PROBLEM_API = protocol + GATEWAY_API + "problems/"
export const FILES_SERVER = protocol + GATEWAY_API + "files/get/"
export const FILES_API = protocol + GATEWAY_API + "files/"
export const MATERIAL_API = protocol + GATEWAY_API + "materials/"
export const TOURNAMENTS_API = protocol + GATEWAY_API + "tournaments/"
export const REGISTRATION_API = protocol + GATEWAY_API + "registration/"
export const NOTIFICATIONS_API = protocol + GATEWAY_API + "notifications/"
export const USERS_API = protocol + GATEWAY_API + "users/"
export const EMAIL_VERIFICATION_API = webSocketProtocol + GATEWAY_API + "users/test"