"use client"
import { useFindUsersQuery, useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import { AutocompleteWithPreview } from "./AutocompleteWithPreview"
import { RefObject, useEffect, useRef, useState } from "react"
import { User } from "@/types/UsersApi"
import { formatDate } from "@/components/pickers/DatePicker"

function formatUserName(user: User) {
  return `${user.firstName} ${user.secondName} ${user.thirdName}`
}

const labelClassName = "flex flex-col gap-1 text-sm leading-5 font-medium text-text-main"
const inputClassName =
  "bg-bg-alt h-10 w-[16rem] md:w-[20rem] font-normal rounded-md border border-border pl-3.5 text-base text-text-main focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"

export default function PersonPicker({
  label,
  placeholder,
  name,
  selectedValue,
  defaultUserId,
}: {
  label: string
  placeholder: string
  name: string
  selectedValue?: RefObject<User | null>
  defaultUserId?: number
}) {
  const hasDefault = typeof defaultUserId === "number" && defaultUserId > 0
  const [query, setQuery] = useState("")
  const { data, isFetching, isError } = useFindUsersQuery({ query: query }, { skip: query.length < 1 })
  const { data: defaultUser, isLoading: isDefaultUserLoading } = useGetUserByIdQuery(
    { id: defaultUserId ?? 0 },
    { skip: !hasDefault },
  )
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const [selectedId, setSelectedId] = useState<number | "">(
    typeof defaultUserId === "number" && defaultUserId > 0 ? defaultUserId : "",
  )

  useEffect(() => {
    console.log("Update query: ", hiddenInputRef.current)
  }, [query])

  useEffect(() => {
    if (defaultUser && selectedValue) {
      selectedValue.current = defaultUser
    }
  }, [defaultUser, selectedValue])

  return (
    <>
      <input type="hidden" name={name} value={selectedId} readOnly />
      {hasDefault && isDefaultUserLoading ? (
        <label className={labelClassName}>
          {label}
          <input disabled className={inputClassName} placeholder="Загрузка..." />
        </label>
      ) : (
        <AutocompleteWithPreview.Root
          inputRef={hiddenInputRef}
          items={data}
          isLoading={isFetching}
          setQuery={setQuery}
          defaultValue={defaultUser ? formatUserName(defaultUser) : undefined}
          label={label}
          error={isError ? "Не найдено" : undefined}
          placeholder={placeholder}
          classNames={{
            label: labelClassName,
            input: inputClassName,
          }}
          onClose={(item) => {
            if (item != null) {
              console.log("closed", item)

              setSelectedId(item.id)
              if (selectedValue) {
                selectedValue.current = item
              }
            }
          }}
        >
          <AutocompleteWithPreview.Portal>
            <AutocompleteWithPreview.Positioner
              className="border-border z-20 overflow-hidden rounded-md border outline-none"
              sideOffset={4}
              align="start"
            >
              <AutocompleteWithPreview.Status.Root className="bg-bg-alt text-text-alt top-0 right-0 left-0 flex items-center gap-2 py-2 pr-8 pl-4 text-sm">
                <AutocompleteWithPreview.Status.Loading>
                  <>
                    <div
                      className="border-border size-4 animate-spin rounded-full border-2 border-t-gray-600 dark:border-t-gray-200"
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
              <AutocompleteWithPreview.Popup className="border-border text-text-main bg-bg-alt flex max-h-[min(var(--available-height),23rem)] w-[calc(var(--anchor-width)*2)] max-w-(--available-width) flex-row border-t-2 shadow-lg shadow-gray-200 dark:shadow-none">
                <div className="w-1/2 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain">
                  <AutocompleteWithPreview.Empty className="text-text-alt px-4 py-2 text-[0.925rem] leading-4 empty:m-0 empty:p-0">
                    Люди не найдены.
                  </AutocompleteWithPreview.Empty>
                  <AutocompleteWithPreview.List>
                    {(user: User) => (
                      <AutocompleteWithPreview.Item
                        key={user.id}
                        className="text-text-main data-highlighted:before:bg-hover flex cursor-default py-2 pr-8 pl-4 text-base leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded"
                        value={`${user.firstName} ${user.secondName} ${user.thirdName}`}
                      >
                        {user.firstName} {user.secondName} {user.thirdName}
                      </AutocompleteWithPreview.Item>
                    )}
                  </AutocompleteWithPreview.List>
                </div>
                <div className="text-text-main border-border flex w-1/2 flex-1 items-center justify-center border-l-2">
                  <div className="w-full p-2 text-center">
                    <AutocompleteWithPreview.Preview>
                      {(preview: User | null) => {
                        return preview ? (
                          <>
                            <p>{`${preview.firstName} ${preview.secondName} ${preview.thirdName}`}</p>
                            {preview.birthday && <p>Дата рождения: {formatDate(new Date(preview.birthday))}</p>}
                            {/* <p>Почта: {preview.email}</p> */}
                          </>
                        ) : (
                          "Наведите курсором мыши на элемент чтобы посмотреть превью"
                        )
                      }}
                    </AutocompleteWithPreview.Preview>
                  </div>
                </div>
                <AutocompleteWithPreview.Sentinel className="h-4" scrollMargin="0px 0px" />
              </AutocompleteWithPreview.Popup>
            </AutocompleteWithPreview.Positioner>
          </AutocompleteWithPreview.Portal>
        </AutocompleteWithPreview.Root>
      )}
    </>
  )
}
