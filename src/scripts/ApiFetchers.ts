"use server"
import { SuggestionInterface, SuggestionShenma } from "@/types/GeoCoderTypes"

async function fetchWithRetryAndTimeout(
  url: string,
  init?: RequestInit,
  retry: number = 0,
  timeout: number = 5000
): Promise<Response | null> {
  if (!init) init = {}
  try {
    const controller = new AbortController()
    if (init?.signal) init.signal.addEventListener("abort", controller.abort)
    init.signal = controller.signal
    const timeoutId =
      timeout > 0
        ? setTimeout(() => {
            controller.abort()
          }, timeout)
        : undefined
    const response = await fetch(url, init)
    if (timeoutId) clearTimeout(timeoutId)
    if (!response.ok) {
      console.error(`Request to ${url} failed with status ${response.status}`)
      if (retry > 1) return fetchWithRetryAndTimeout(url, init, retry - 1, timeout)
      return null
    }
    return response
  } catch (e) {
    console.error(`Request to ${url} failed with exception: ${e}`)
    if (retry > 1) return fetchWithRetryAndTimeout(url, init, retry - 1, timeout)
    return null
  }
}


export async function getGeoData(addres: string): Promise<SuggestionInterface | null> {
  const bodyObject = {
    query: addres,
    count: 1
  }
  console.log("APIKEY", addres)
  const response = await fetchWithRetryAndTimeout("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
    method: "POST",
    headers: {
      "Authorization": "Token " + process.env.DADATA_API,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyObject)
  })
  console.log("APIKEY resp", response)
  if (!response) return null
  const respJSON = SuggestionShenma.safeParse(await response.json())
  console.log("APIKEY after parse", respJSON)
  if (respJSON.success) return respJSON.data
  
  console.error(`Unexpected response while parsing geo data for address "${addres}": ${respJSON.error}`)
  return null
}