"use client"
import {useRouter} from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default function TournamentsPageTabs(
  {tab}: { tab: string }
) {
  const router = useRouter()
  return (
    <>
      <div className="flex justify-center items-center pt-2">
        <div className="flex bg-bg-alt w-fit justify-center items-center rounded-xl overflow-hidden">
          <div className={clsx("flex font-medium h-full", {"text-text-alt hover:opacity-80": tab !== "info"}, {"text-accent-primary border-b-4 border-accent-primary": tab === "info"})}><Link href="info"><p className="py-2 ps-3 px-2">Инфо</p></Link></div>
          <div className={clsx("flex font-medium", {"text-text-alt hover:opacity-80": tab !== "results"}, {"text-accent-primary border-b-4 border-accent-primary": tab === "results"})}><Link href="results"><p className="py-2 px-2">Результаты</p></Link></div>
          <div className={clsx("flex font-medium", {"text-text-alt hover:opacity-80": tab !== "fights"}, {"text-accent-primary border-b-4 border-accent-primary": tab === "fights"})}><Link href="fights"><p className="py-2 px-2">Бои</p></Link></div>
          <div className={clsx("flex font-medium", {"text-text-alt hover:opacity-80": tab !== "stats"}, {"text-accent-primary border-b-4 border-accent-primary": tab === "stats"})}><Link href="stats"><p className="py-2 pe-3 px-2">Статистика</p></Link></div>
        </div>
      </div>

    </>
  )
}