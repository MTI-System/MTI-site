"use client"
import { AlertDialog } from "@base-ui-components/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCloseRegistrationMutation } from "@/api/tournaments/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function CloseRegistration({ tournamentId }: { tournamentId: number }) {
  const token = useAppSelector((state) => state.auth.token)
  const [closeRegistration, { isLoading, isSuccess }] = useCloseRegistrationMutation()
  const [dialogOpen, setDialogOpen] = useState(false)

  const router = useRouter()
  useEffect(() => {
    if (isLoading == false) {
      setDialogOpen(false)
      router.refresh()
    }
  }, [isLoading])

  return (
    <>
      <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialog.Trigger className="border-border hover:bg-bg-alt focus-visible:outline-accent-primary active:bg-bg-alt mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-md border bg-gray-50 px-3.5 text-base font-medium text-red-800 select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1">
          Закрыть регистрацию на турнир
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
          <AlertDialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
            <AlertDialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
              Закрыть регистрацию на турнир
            </AlertDialog.Title>
            <AlertDialog.Description className="mb-6 text-base text-gray-600">
              Вы не сможете отменить это действие
            </AlertDialog.Description>
            <div className="flex justify-end gap-4">
              <AlertDialog.Close
                disabled={isLoading}
                className="disabled:hover:bg-bg-alt border-border bg-bg-alt text-text-main hover:bg-hover focus-visible:outline-accent-primary flex h-10 cursor-pointer items-center justify-center rounded-md border px-3.5 text-base font-medium select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 disabled:cursor-auto"
              >
                Отмена
              </AlertDialog.Close>
              <button
                onClick={() => {
                  closeRegistration({
                    tournamentId: tournamentId,
                    token: token,
                  })
                }}
                disabled={isLoading}
                className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-red-800 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 disabled:animate-pulse disabled:cursor-auto disabled:bg-red-800/20"
              >
                {isLoading ? "Закрытие..." : "Закрыть"}
              </button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}
