"use server"
import OrganizationProblemPage from "@/components/sections/organizator/problems/OrganizationProblemPage";

export default async function editProblems({searchParams}: { searchParams: Promise<{ year: number }> }) {
  const year = (await searchParams).year ?? 2026
  return (
      <OrganizationProblemPage year={year}/>
  )
}

