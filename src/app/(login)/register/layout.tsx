import { Metadata } from "next"

export function generateMetadata(): Metadata {
  const titleText = "Регистрация · МТИ"
  const descriptionText = "Регистрация в системе Менеджера Турнирной Информации"

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}


export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}