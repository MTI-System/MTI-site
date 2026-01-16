import {EMAIL_VERIFICATION_API} from "@/constants/APIEndpoints";
import {SocketSingleton} from "@/api/auth/SocketSingleton";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const arr = new Uint8Array(16)
crypto.getRandomValues(arr)

export const userToken = Array.from(arr)
  .map((v) => chars[v % chars.length])
  .join("")

export const emailSocket = SocketSingleton.getInstance(
  EMAIL_VERIFICATION_API,
  () => userToken
)
