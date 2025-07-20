"use client"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

export default function useSearchParam(searchParamName: string): [boolean, string | null, (newValue: string) => void] {
  const searchParams = useSearchParams()
  const path = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [paramValue, setParamValue] = useState(searchParams.get(searchParamName))
  const updateParam = (newValue: string) => {
    setParamValue(newValue)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set(searchParamName, newValue)

    startTransition(() => {
      router.replace(`${path}?${newParams.toString()}`)
    })
  }
  useEffect(() => {
    setParamValue(searchParams.get(searchParamName))
  }, [searchParams.get(searchParamName)])
  return [isPending, paramValue, updateParam]
}
