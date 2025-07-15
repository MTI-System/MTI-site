"use server"
import OrganizationProblemPage from "@/components/sections/organizator/problems/OrganizationProblemPage";

export default async function editProblems({searchParams}: { searchParams: Promise<{ year: number; tt: string }> }) {
  const year = (await searchParams).year ?? 2026
  return (
      <OrganizationProblemPage searchParams={searchParams}/>
  )
}

