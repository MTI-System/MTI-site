
import type {Metadata} from "next";
import {redirect} from "next/navigation";



export default async function EmptyTPage({ params }: { params: Promise<{ id: number }> }) {
  redirect(`tournaments/${(await params).id}/info/about`)
}
