"use client"

import { useFindUsersQuery } from "@/api/users/clientApiInterface"
import { Autocomplete } from "./Autocomplete"
import { useEffect, useState } from "react"
import { User } from "@/types/UsersApi"
import { Popover } from "@base-ui-components/react"

export default function PersonPicker({ label, placeholder }: { label: string; placeholder: string }) {
  const [query, setQuery] = useState("")
  const { data, isFetching, isError } = useFindUsersQuery({ query: query })
  return (
    <Autocomplete.Root
      items={data}
      isLoading={isFetching}
      setQuery={setQuery}
      label={label}
      error={isError ? "Не найдено" : undefined}
      placeholder={placeholder}
      classNames={{
        label: "flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900",
        input:
          "bg-[canvas] h-10 w-[16rem] md:w-[20rem] font-normal rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800",
      }}
    >
      <Autocomplete.Portal>
        <Autocomplete.Positioner className="outline-none" sideOffset={4}>
          <Autocomplete.Status.Root className="bg-bg-alt top-0 right-0 left-0 flex items-center gap-2 py-2 pr-8 pl-4 text-sm text-gray-600">
            <Autocomplete.Status.Loading>
              <>
                <div
                  className="size-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600"
                  aria-hidden
                />
                Поиск...
              </>
            </Autocomplete.Status.Loading>
            <Autocomplete.Status.Info>
              <p>Найдено людей: {data?.length ?? 0}</p>
            </Autocomplete.Status.Info>
            <Autocomplete.Status.Error className="text-red-500"></Autocomplete.Status.Error>
          </Autocomplete.Status.Root>
          <Autocomplete.Popup className="max-h-[min(var(--available-height),23rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain rounded-md bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <Autocomplete.Empty className="px-4 py-2 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0">
              Люди не найдены.
            </Autocomplete.Empty>
            <Autocomplete.List>{PopoveredItem}</Autocomplete.List>

            <Autocomplete.Sentinel className="h-4" scrollMargin="0px 0px" />
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}

function PopoveredItem(user: User) {
  return (
    <Popover.Root openOnHover key={user.id}>
      <Popover.Trigger>
        <Autocomplete.Item
          className="flex cursor-default py-2 pr-8 pl-4 text-base leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded data-[highlighted]:before:bg-gray-900"
          object={user}
          value={`${user.firstName} ${user.secondName} ${user.thirdName}`}
        >
          {user.firstName} {user.secondName} {user.thirdName}
        </Autocomplete.Item>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} side="right">
          <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <Popover.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <ArrowSvg />
            </Popover.Arrow>
            <Popover.Title className="text-base font-medium">Preview</Popover.Title>
            <Popover.Description>
              <Autocomplete.Preview>
                {(preview: User | null) => {
                  return preview
                    ? `${preview.firstName} ${preview.secondName} ${preview.thirdName}`
                    : "Наведите курсором мыша на элемент чтобы посмотреть превью"
                }}
              </Autocomplete.Preview>
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-[canvas]"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  )
}
