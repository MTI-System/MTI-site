"use client"
import Loading from "@/app/loading"
import { getGeoData } from "@/scripts/ApiFetchers"
import { SuggestionInterface } from "@/types/GeoCoderTypes"
import { debounce } from "next/dist/server/utils"
import { useEffect, useRef, useState } from "react"

export default function LocationPicker({
  onChange,
  initLocation,
}: {
  onChange: (textAddress: string, lat: number | null, lon: number | null) => void
  initLocation: string | null
}) {
  const [lat, setLat] = useState<number>(63.19994)
  const [lon, setLon] = useState<number>(75.41213)
  const [textAddress, setTextAddress] = useState<string>(initLocation ?? "")
  const [mapState, setMapState] = useState<string>(!initLocation ? "init" : "loading")
  const getLocation = async (addres: string): Promise<SuggestionInterface | null> => {
    const data = await getGeoData(addres)
    return data ?? null
  }
  const debouncedUpdateMapRef = useRef(
    debounce((textAddress: string) => {
      if (!textAddress) {
        setMapState("init")
        return
      }
      setMapState("loading")
      getLocation(textAddress).then((response) => {
        if (response) {
          try {
            setLat(Number(response.suggestions[0].data.geo_lat))
            setLon(Number(response.suggestions[0].data.geo_lon))
            onChange(response.suggestions[0].unrestricted_value, lat, lon)
            setMapState("ready")
          } catch {
            setMapState("error")
          }
        } else {
          onChange(textAddress, null, null)
          setMapState("error")
        }
      })
    }, 1000),
  )

  const fetchAddress = (address: string) => {
    debouncedUpdateMapRef.current(address)
  }
  useEffect(() => {
    fetchAddress(textAddress)
  }, [textAddress])

  const frameUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.02}%2C${
    lon + 0.05
  }%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lon}`

  return (
    <>
      <input
        className="border-border h-10 w-full border bg-white"
        placeholder="Введите адрес здесь"
        onChange={(e) => {
          setTextAddress(e.target.value)
        }}
        defaultValue={initLocation ?? ""}
      />
      <div className="relative h-[350px] w-[425px]">
        <iframe
          width="425"
          height="350"
          src={frameUrl}
          key={frameUrl}
          className="absolute z-0"
          style={{
            border: "1px solid black",
          }}
        ></iframe>
        {mapState === "loading" && (
          <div className="absolute z-1 h-[350px] w-[425px] bg-white/50">
            <Loading />
          </div>
        )}
        {mapState === "init" && (
          <div className="absolute z-1 flex h-[350px] w-[425px] items-center justify-center bg-white/50">
            <p className="px-2 text-center font-medium">Начните вводить адрес в поле для отображения карты</p>
          </div>
        )}
        {mapState === "error" && (
          <div className="absolute z-1 flex h-[350px] w-[425px] items-center justify-center bg-white/50">
            <p className="px-2 text-center font-medium">Ошибка отображения. Проверьте адрес</p>
          </div>
        )}
      </div>
    </>
  )
}
