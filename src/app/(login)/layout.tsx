import "@/styles/app/main.css"
import LayoutComponent from "@/components/sections/app/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <LayoutComponent>{children}</LayoutComponent>
  )
}
