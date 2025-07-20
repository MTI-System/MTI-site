"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { FaSignInAlt, FaUserCircle } from "react-icons/fa"
import {useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";

export default function ProfilePicture({ className }: { className: string }) {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const auth = useAppSelector(state => state.auth.authInfo)
  const path = usePathname()
  return isAuthenticated ? (
    <Link href={"/profile"}>
      <FaUserCircle className={className} />
    </Link>
  ) : (
    <Link href={`/login?redirect=${path.slice(1)}`}>
      <FaSignInAlt className={className} />
    </Link>
  )
}
