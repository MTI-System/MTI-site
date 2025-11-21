import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return <ProblemsProviderWrapper>{children}</ProblemsProviderWrapper>
}
