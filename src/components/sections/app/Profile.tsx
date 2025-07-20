"use client"

import { AuthContext } from "@/context/app/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { FaSignInAlt, FaUserCircle } from "react-icons/fa"

export default function ProfilePicture({ className }: { className: string }) {
  const authObject = useContext(AuthContext)
  const path = usePathname()
  return authObject ? (
    <Link href={"/profile"}>
      <FaUserCircle className={className} />
    </Link>
  ) : (
    <Link href={`/login?redirect=${path.slice(1)}`}>
      <FaSignInAlt className={className} />
    </Link>
  )
}
