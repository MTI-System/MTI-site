"use client"
import { Autocomplete } from "@base-ui-components/react/autocomplete"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { AutocompleteRootContext } from "./RootContext"
import { debounce } from "next/dist/server/utils"

interface RootProps<T> extends Omit<Autocomplete.Root.Props<T>, "items" | "defaultOpen" | "mode" | "filter"> {
  items?: readonly T[] | null
  isLoading: boolean
  error?: string
  setQuery: Dispatch<SetStateAction<string>>
  handleScroll?: () => Promise<void>
  label: string
  placeholder: string
  classNames?: {
    label: string
    input: string
  }
  debounceTime?: number
  onClose: (item: T) => void
}

export function Root<T>({
  children,
  items,
  isLoading,
  error,
  setQuery,
  handleScroll,
  label,
  placeholder,
  classNames,
  onClose,
  debounceTime = 500,
  ...rest
}: RootProps<T>) {
  const [preview, setPreview] = useState<T | null>(null)
  const [isLoadingInternal, setIsLoadingInternal] = useState(false)
  const handlePreview = (item: T | undefined) => {
    setPreview(item ?? null)
  }
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setQuery(value)
      setIsLoadingInternal(false)
    }, debounceTime),
    [setQuery, debounceTime],
  )
  return (
    <AutocompleteRootContext
      value={{
        selectedItem: preview,
        scrollCallback: async () => {
          await handleScroll?.()
        },
        isLoading: isLoadingInternal || isLoading,
        error,
        preview,
        handlePreview,
      }}
    >
      <Autocomplete.Root
        mode="none"
        defaultOpen={false}
        filter={null}
        items={error ? [] : (items ?? [])}
        onValueChange={(value, e) => {
          setPreview(null)
          setIsLoadingInternal(true)
          debouncedSetQuery(value)
          rest.onValueChange?.(value, e)
        }}

        onItemHighlighted={
          (itemValue, e) => {
            handlePreview(itemValue)
            rest.onItemHighlighted?.(itemValue, e)
          }
        }
        onOpenChange={(open, e)=>{
          if (!open) onClose(preview)
          rest.onOpenChange && rest.onOpenChange(open, e)
        }}
        {...rest}
      >
        <label className={classNames?.label}>
          {label}
          <Autocomplete.Input placeholder={placeholder} className={classNames?.input} />
        </label>
        {children}
      </Autocomplete.Root>
    </AutocompleteRootContext>
  )
}
