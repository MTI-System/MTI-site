import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export default function twclsx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
