"use client"
import React from "react"
import { CardsRootProvider } from "@/components/forms/root/RootContext"
import { ConstructorRootProvider } from "@/components/formConstructor/root/RootContext"
import RegistrationProviderWrapper from "@/api/registration/ClientWrapper"

export function ConstructorRoot({
  children,
  formType,
  tournamentId,
}: {
  children: React.ReactNode
  formType: string
  tournamentId: number
}) {
  return (
    <>
      <RegistrationProviderWrapper>
        <ConstructorRootProvider formType={formType} tournamentId={tournamentId}>
          {children}
        </ConstructorRootProvider>
      </RegistrationProviderWrapper>
    </>
  )
}
