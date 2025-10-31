"use client"

import {useCardsRoot} from "@/components/forms/root/RootContext";
import {useEffect} from "react";

export function InputField(
  {
    onVerification,
  }:{
    onVerification: () => boolean;
  }
) {
  const {register} = useCardsRoot()
  useEffect(() => {
    register(onVerification)
  }, []);



  return (
    <div className="flex flex-col">
      asd
    </div>
  );
}