"use client"
import { useFindUsersQuery } from "@/api/users/clientApiInterface"
import { AutocompleteWithPreview } from "./AutocompleteWithPreview"
import { RefObject, useEffect, useRef, useState } from "react"
import { User } from "@/types/UsersApi"

export default function PersonPicker({
  label,
  placeholder,
  name,
  selectedValue,
}: {
  label: string
  placeholder: string
  name: string
  selectedValue?: RefObject<User | null>
}) {
  const [query, setQuery] = useState("")
  const { data, isFetching, isError } = useFindUsersQuery({ query: query }, {skip: query.length < 1})
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log("Update query: ", hiddenInputRef.current)
  }, [query])

  return (
    <AutocompleteWithPreview.Root
      name={name}
      inputRef={hiddenInputRef}
      items={data}
      isLoading={isFetching}
      setQuery={setQuery}
      // submitOnItemClick={true}
      label={label}
      error={isError ? "Не найдено" : undefined}
      placeholder={placeholder}
      classNames={{
        label: "flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900 text-text-main",
        input:
          "bg-[canvas] h-10 w-[16rem] md:w-[20rem] font-normal rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 text-text-main",
      }}
      onClose={(item) => {
        if (item != null) {
          console.log("closed", item)

          if (selectedValue) {
            selectedValue.current = item
          }

        }
      }}
    >
      <AutocompleteWithPreview.Portal>
        <AutocompleteWithPreview.Positioner className="outline-none" sideOffset={4} align="start">
          <AutocompleteWithPreview.Status.Root className="bg-bg-alt top-0 right-0 left-0 flex items-center gap-2 py-2 pr-8 pl-4 text-sm text-gray-600">
            <AutocompleteWithPreview.Status.Loading>
              <>
                <div
                  className="size-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600"
                  aria-hidden
                />
                Поиск...
              </>
            </AutocompleteWithPreview.Status.Loading>
            <AutocompleteWithPreview.Status.Info>
              <p>Найдено людей: {data?.length ?? 0}</p>
            </AutocompleteWithPreview.Status.Info>
            <AutocompleteWithPreview.Status.Error className="text-red-500"></AutocompleteWithPreview.Status.Error>
          </AutocompleteWithPreview.Status.Root>
          <AutocompleteWithPreview.Popup className="flex max-h-[min(var(--available-height),23rem)] w-[calc(var(--anchor-width)*2)] max-w-(--available-width) flex-row rounded-md border-t-2 border-gray-200 bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <div className="w-1/2 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain">
              <AutocompleteWithPreview.Empty className="px-4 py-2 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0">
                Люди не найдены.
              </AutocompleteWithPreview.Empty>
              <AutocompleteWithPreview.List>
                {(user: User) => (
                  <AutocompleteWithPreview.Item
                    key={user.id}
                    className="flex text-text-main cursor-default py-2 pr-8 pl-4 text-base leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded data-highlighted:before:bg-gray-900"
                    value={`${user.firstName} ${user.secondName} ${user.thirdName}`}
                  >
                    {user.firstName} {user.secondName} {user.thirdName}
                  </AutocompleteWithPreview.Item>
                )}
              </AutocompleteWithPreview.List>
            </div>
            <div className="flex w-1/2 flex-1 items-center justify-center text-text-main border-l-2 border-gray-200">
              <p className="w-full p-2 text-center">
                <AutocompleteWithPreview.Preview>
                  {(preview: User | null) => {
                    return preview
                      ? `${preview.firstName} ${preview.secondName} ${preview.thirdName}`
                      : "Наведите курсором мыша на элемент чтобы посмотреть превью"
                  }}
                </AutocompleteWithPreview.Preview>
              </p>
            </div>
            <AutocompleteWithPreview.Sentinel className="h-4" scrollMargin="0px 0px" />
          </AutocompleteWithPreview.Popup>
        </AutocompleteWithPreview.Positioner>
      </AutocompleteWithPreview.Portal>
    </AutocompleteWithPreview.Root>
  )
}
