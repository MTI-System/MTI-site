"use client"
import { Switch } from "@base-ui-components/react/switch"
import { useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"

export default function JurySwitch({ isJury }: { isJury: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, startTransition] = useTransition()
  return (
    <div className="flex content-baseline items-center gap-4 pt-4 pl-2">
      <p className="text-text-main text-2xl">Форма для жюри</p>
      <Switch.Root
        checked={isJury}
        onCheckedChange={(checked) => {
          startTransition(() => {
            router.push(pathname + (checked ? "?jury=true" : ""))
          })
        }}
        className="from-accent-primary to-inactive relative flex h-6 w-10 rounded-full bg-gradient-to-r from-35% to-65% bg-[length:6.5rem_100%] bg-[100%_0%] bg-no-repeat p-px transition-[background-position,box-shadow] duration-[125ms] ease-[cubic-bezier(0.26,0.75,0.38,0.45)] before:absolute before:rounded-full before:outline-offset-2 before:outline-blue-800 focus-visible:before:inset-0 focus-visible:before:outline focus-visible:before:outline-2 active:bg-gray-100 data-[checked]:bg-[0%_0%] data-[checked]:active:bg-gray-500"
      >
        <Switch.Thumb className="aspect-square h-full rounded-full bg-white transition-transform duration-150 data-[checked]:translate-x-4 dark:shadow-black/25" />
      </Switch.Root>
    </div>
  )
}
