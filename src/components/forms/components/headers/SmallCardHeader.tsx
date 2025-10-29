import { FILES_SERVER } from "@/constants/APIEndpoints";
import Link from "next/link";
import BigImage from "./imagesContainers/BigImage";

export default function SmallCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <Link href="#">
      <div
        className={
          "bg-bg-alt border-bg-main hover:border-accent-primary flex aspect-[8/9] h-[37rem] flex-col overflow-hidden rounded-3xl border-2 transition-all duration-500"
        }
      >
        <div className="relative h-[64%]">
          {children}
        </div>
      </div>
    </Link>

  )
}
