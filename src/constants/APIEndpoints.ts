export const GATEWAY_API = process.env.IS_ON_DEV === "true" ? "host.docker.internal:host-gateway:8095/" : "https://api.mtiyt.ru/"
export const AUTH_API = GATEWAY_API + "auth/"
export const PROBLEM_API = GATEWAY_API + "problems/"
export const FILES_SERVER = GATEWAY_API + "files/get/"
export const MATERIAL_API = GATEWAY_API + "materials/"

// export const AUTH_API = "http://host.docker.internal:8082/api/"
// export const PROBLEM_API = "http://host.docker.internal:8080/api/problems/"
// export const FILES_SERVER = "https://files.mofius-server.ru/media/get/"
