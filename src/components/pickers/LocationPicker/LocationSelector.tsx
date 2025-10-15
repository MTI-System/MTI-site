"use client"
import { Checkbox, Popover } from "@base-ui-components/react"
import { FaEdit } from "react-icons/fa"
import LocationPicker from "./LocationPicker"
import { useEffect, useState } from "react"
import { TournamentCardCallback } from "@/app/(main)/organizators/create/page"
import { CheckIcon } from "@/components/problems/ShareButton"

export default function LocationSelector({ onPick }: { onPick: TournamentCardCallback | null }) {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false)
  const [currentObject, setCurrentObject] = useState<{ textAddress: string; lat: number | null; lon: number | null }>({
    textAddress: "",
    lat: null,
    lon: null,
  })
  const [displayedValue, setDisplayedValue] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  return (
    <>
      <Popover.Root
        open={isPopoverOpened}
        onOpenChange={(e) => {
          setIsPopoverOpened(e)
        }}
      >
        <Popover.Trigger className="">
          <div className="hover:text-accent-primary flex cursor-pointer items-center gap-2 transition-colors">
            <span className="text-[0.8rem]">{displayedValue ?? "Выберите адрес"}</span>
            <FaEdit />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner className="relative z-2" sideOffset={8} align={"end"}>
            <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
              <label className="flex items-center gap-2 text-base text-gray-900">
                <Checkbox.Root
                  checked={isOnline}
                  onCheckedChange={(checked) => {
                    setIsOnline(checked)
                    if (checked) {
                      setCurrentObject({
                        textAddress: "Онлайн",
                        lat: null,
                        lon: null,
                      })
                    } else {
                      setCurrentObject({
                        textAddress: "",
                        lat: null,
                        lon: null,
                      })
                    }
                  }}
                  className="flex size-5 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
                >
                  <Checkbox.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
                    <CheckIcon className="size-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                Турнир проводится онлайн
              </label>
              {!isOnline && (
                <LocationPicker
                  onChange={(textAddress: string, lat: number | null, lon: number | null) => {
                    setCurrentObject({
                      textAddress: textAddress,
                      lat: lat,
                      lon: lon,
                    })
                  }}
                  initLocation={displayedValue}
                />
              )}
              <button
                onClick={() => {
                  setIsPopoverOpened(false)
                  setDisplayedValue(isOnline ? "Онлайн" : currentObject.textAddress)
                  onPick &&
                    onPick({
                      location: isOnline ? "Онлайн" : currentObject.textAddress,
                      location_lat: isOnline ? undefined : (currentObject.lat ?? undefined),
                      location_lon: isOnline ? undefined : (currentObject.lon ?? undefined),
                    })
                }}
                className="bg-accent-primary/25 hover:bg-accent-primary/50 text-accent-primary border-accent-primary mt-[1rem] w-full rounded-2xl border-3 p-2"
              >
                Применить
              </button>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
