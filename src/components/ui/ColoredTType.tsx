"use client"
import {useEffect} from "react";

export default function ColoredTType({ttName, ttColor, className}: {ttName: string, ttColor: string, className?: string}) {
    useEffect(()=>{
        console.log("Rerentder ttname", ttName)
    }, [ttName])
  return (
      <div className={className}>
          {ttName.slice(0, 2)}
          <span style={{color: ttColor}}>{ttName.slice(2)}</span>
      </div>
  )
}