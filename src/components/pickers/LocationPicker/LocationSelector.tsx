"use client"
import { Popover } from "@base-ui-components/react"
import { FaEdit } from "react-icons/fa"
import LocationPicker from "./LocationPicker"
import { useEffect, useState } from "react"
import { TournamentCardCallback } from "@/app/(main)/organizators/create/page"

export default function LocationSelector(
    {onPick}: {onPick: TournamentCardCallback|null}
){
    const [isPopoverOpened, setIsPopoverOpened] = useState(false)
    const [currentObject, setCurrentObject] = useState<{textAddress: string, lat: number|null, lon: number|null}>({
        textAddress: "",
        lat: null,
        lon: null
    })
    const [displayedValue, setDisplayedValue] = useState<string|null>(null)
    useEffect(()=>{
        if(!isPopoverOpened && currentObject.lat && currentObject.lon){
            setDisplayedValue(currentObject.textAddress)
            onPick && onPick({
                location: currentObject.textAddress,
                location_lat: currentObject.lat,
                location_lon: currentObject.lon
            })
        }
    }, [isPopoverOpened])
    return (
        <>
            <Popover.Root open={isPopoverOpened} onOpenChange={(e)=>{
                    setIsPopoverOpened(e)
                }}>
                <Popover.Trigger className="">
                    <div className="flex items-center gap-2 hover:text-accent-primary transition-colors cursor-pointer">
                        <span className="text-[0.8rem]">{displayedValue??"Выберите адрес"}</span>
                        <FaEdit />
                    </div>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Positioner className="relative z-2" sideOffset={8} align={"end"}>
                    <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                        <LocationPicker onChange={(textAddress: string, lat: number|null, lon: number|null)=>{
                            setCurrentObject({
                                textAddress: textAddress,
                                lat: lat,
                                lon: lon
                            })
                            
                        }}
                        initLocation={displayedValue}/>
                        <button
                        onClick={() => {
                            setIsPopoverOpened(false)
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