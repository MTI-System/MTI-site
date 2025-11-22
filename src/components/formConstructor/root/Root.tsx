"use client"
import React from "react"
import { CardsRootProvider } from "@/components/forms/root/RootContext"
import { ConstructorRootProvider } from "@/components/formConstructor/root/RootContext"

export function ConstructorRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConstructorRootProvider>{children}</ConstructorRootProvider>
    </>
  )
}
