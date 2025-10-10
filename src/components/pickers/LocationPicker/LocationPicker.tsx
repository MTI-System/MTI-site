"use client"
import { useGetGeoDataMutation } from "@/api/geocoder/clientApiInterface"
import { geoApiServer } from "@/api/geocoder/serverApiInterface"
import { makeGeoStoreServer } from "@/api/geocoder/serverStore"
import Loading from "@/app/loading"
import { getGeoData } from "@/app/scripts/ApiFetchers"
import { SuggestionInterface } from "@/types/GeoCoderTypes"
import { debounce } from "next/dist/server/utils"
import { useEffect, useRef, useState } from "react"

export default function LocationPicker(
  {onChange, initLocation}: {onChange: (textAddress: string, lat: number|null, lon: number|null)=>void, initLocation: string|null}
) {
  const [lat, setLat] = useState<number>(63.19994)
  const [lon, setLon] = useState<number>(75.41213)
  const [textAddress, setTextAddress] = useState<string>(initLocation??"")
  const [mapState, setMapState] = useState<string>(!initLocation ? "init" : "loading")
  const getLocation = async (addres: string): Promise<SuggestionInterface | null> => {
    const data = await getGeoData(addres)
    return data ?? null
    }
  const debouncedUpdateMapRef = useRef(
    debounce((textAddress: string) => {
        if(!textAddress) {
          setMapState("init")
          return
        }
        setMapState("loading")
        getLocation(textAddress).then((response)=>{
        if(response){
          try{
            setLat(Number(response.suggestions[0].data.geo_lat))
            setLon(Number(response.suggestions[0].data.geo_lon))
            onChange(response.suggestions[0].unrestricted_value, lat, lon)
            setMapState("ready")
          }
          catch{
            setMapState("error")
          }
        }
        else{
            onChange(textAddress, null, null)
            setMapState("error")
        }
        })
    }, 1000)
  );


  const fetchAddress = (address: string) => {
    debouncedUpdateMapRef.current(address);
  }
  useEffect(()=>{
    fetchAddress(textAddress)
  }, [textAddress])

  const frameUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      lon - 0.05
      }%2C${
      lat - 0.02
      }%2C${
      lon + 0.05
      }%2C${
      lat + 0.02
      }&layer=mapnik&marker=${lat}%2C${lon}`

  return (
    <>  
      <input 
        className="w-full h-10 bg-white border border-border"
        placeholder="Введите адрес здесь" 
        onChange={(e) => {setTextAddress(e.target.value)}}
        defaultValue={initLocation??""}
      />
      <div className="relative w-[425px] h-[350px]">
        <iframe
        width="425"
        height="350"
        src={frameUrl}
        key={frameUrl}
        className="absolute z-0"
        style={{

            border: "1px solid black"
        }}
      ></iframe>
      {mapState === "loading"&& (
        <div className="absolute bg-white/50 z-1 w-[425px] h-[350px]">
          <Loading/>
        </div>
      )}
      {mapState === "init" && (
        <div className="absolute bg-white/50 z-1 flex items-center justify-center w-[425px] h-[350px]">
          <p className="text-center font-medium px-2">Начните вводить адрес в поле для отображения карты</p>
        </div>
      )}
      {mapState === "error"&& (
        <div className="absolute bg-white/50 flex items-center justify-center z-1 w-[425px] h-[350px]">
          <p className="text-center font-medium px-2">Ошибка отображения. Проверьте адрес</p>
        </div>
      )}
      </div>

    </>
  )
}