"use client"
import { IconInput } from "@/components/ui/Input"
import { IoMdSearch } from "react-icons/io"
import iconStyle from "@/styles/icons.module.css"

export default function GlobalSearch() {
  return <IconInput placeholder="Search" icon={<IoMdSearch className={iconStyle.icons} />} onChange={() => {}} onEnter={() => {}}></IconInput>
}
