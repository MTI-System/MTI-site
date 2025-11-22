"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function EmptyTPage({ params }: { params: Promise<{ id: number }> }) {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    router.push(`${pathname}/info`)
  }, [])
  return (
    <>
      <h1>Нет вкладки</h1>
    </>
  )
}
