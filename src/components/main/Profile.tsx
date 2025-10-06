"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext, useEffect } from "react"
import { FaSignInAlt, FaUserCircle } from "react-icons/fa"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function ProfilePicture({ className }: { className: string }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const auth = useAppSelector((state) => state.auth.authInfo)
  const path = usePathname()
  return (
    <>
      {isAuthenticated && (
        <Link href={"/profile"}>
          <FaUserCircle style={{ width: "100%", height: "50%" }} className={className} />
        </Link>
      )}
      {!isAuthenticated && (
        <Link href={`/login?redirect=${path.slice(1)}`}>
          <FaSignInAlt style={{ width: "100%", height: "50%" }} className={className} />
        </Link>
      )}
    </>
  )

  // isAuthenticated ? (
  //   <Link href={"/profile"}>
  //     <FaUserCircle style={{width: "100%", height: "50%"}} className={className}/>
  //   </Link>
  // ) : (
  //   <Link href={`/login?redirect=${path.slice(1)}`}>
  //     <FaSignInAlt style={{width: "100%", height: "50%"}} className={className}/>
  //   </Link>
  // )
}
