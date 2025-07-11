"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import Loading from "@/app/(main)/loading"

export default function TestComp({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <Test />
      {children}
    </Suspense>
  )
}

function Test() {
  const params = useSearchParams()
  useEffect(() => {
    console.log("Добавляем переменную в строку")
  }, [])
  return <></>
}
