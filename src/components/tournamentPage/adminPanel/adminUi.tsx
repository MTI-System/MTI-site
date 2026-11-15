"use client"

import { Toast } from "@base-ui-components/react"
import { ButtonHTMLAttributes, PropsWithChildren, useCallback } from "react"
import { FaTimes } from "react-icons/fa"
import twclsx from "@/utils/twClassMerge"

export const adminButtonClass =
  "bg-accent-primary/20 border-accent-primary text-accent-primary hover:bg-accent-primary/50 inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70"

export function AdminToastProvider({ children }: PropsWithChildren) {
  return (
    <Toast.Provider>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed top-auto right-4 bottom-4 z-50 mx-auto flex w-[250px] sm:right-8 sm:bottom-8 sm:w-[300px]">
          <AdminToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}

function AdminToastList() {
  const { toasts, close } = Toast.useToastManager()
  return toasts.map((toast) => {
    const isError = toast.type === "error"
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className={twclsx(
          "text-text-main bg-bg-alt absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-(--height) w-full origin-bottom transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-lg border-2 bg-clip-padding p-4 shadow-lg select-none [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-ending-style:opacity-0 data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-limited:opacity-0 data-starting-style:transform-[translateY(150%)] data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))] data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))] data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
          isError ? "border-red-400" : "border-accent-primary",
        )}
      >
        <Toast.Content
          className="overflow-hidden transition-opacity duration-250 data-behind:pointer-events-none data-behind:opacity-0 data-expanded:pointer-events-auto data-expanded:opacity-100"
          onMouseDown={(e) => {
            if (e.button === 1) {
              e.preventDefault()
              close(toast.id)
            }
          }}
        >
          <Toast.Title className="py-2 pr-6 text-[0.975rem] leading-5 font-medium" />
          <Toast.Description className="text-text-alt text-[0.925rem] leading-5" />
          <Toast.Close
            className="text-text-alt hover:bg-hover hover:text-text-main absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded border-none bg-transparent"
            aria-label="Close"
          >
            <FaTimes />
          </Toast.Close>
        </Toast.Content>
      </Toast.Root>
    )
  })
}

export function useAdminFeedback() {
  const toastManager = Toast.useToastManager()

  const run = useCallback(
    async (action: Promise<unknown>, messages: { success: string; error?: string }) => {
      try {
        await action
        toastManager.add({
          title: messages.success,
          description: "Изменения отправлены на сервер",
          type: "success",
          timeout: 4000,
        })
        return true
      } catch (error) {
        console.error("Admin save failed", error)
        toastManager.add({
          title: messages.error ?? "Не удалось сохранить изменения",
          description: "Повторите попытку или обновите страницу",
          type: "error",
          timeout: 6000,
        })
        return false
      }
    },
    [toastManager],
  )

  return { run }
}

export function AdminButton({
  loading,
  children,
  className,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button className={twclsx(adminButtonClass, className)} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          className="border-accent-primary size-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  )
}
