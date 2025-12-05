import AuthProviderWrapper from "@/api/auth/ClientWrapper"
import { Metadata } from "next"

export function generateMetadata(): Metadata {
  const titleText = "Вход в аккаунт · МТИ"
  const descriptionText = "Вход в аккаунт Менеджера Турнирной Информации"

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProviderWrapper>{children}</AuthProviderWrapper>
}
