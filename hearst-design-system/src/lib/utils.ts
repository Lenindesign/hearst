import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the Hearst+ card radius tokens so cn() resolves rounded-card conflicts.
const twMerge = extendTailwindMerge({ extend: { theme: { radius: ["card", "card-inner"] } } })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
