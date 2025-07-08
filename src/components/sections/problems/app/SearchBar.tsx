"use client"
import { IconInput } from "@/components/ui/Input"
import { IoMdSearch } from "react-icons/io"

export default function GlobalSearch() {
  return <IconInput placeholder="Search" icon={<IoMdSearch />} onChange={() => {}} onEnter={() => {}}></IconInput>
}
