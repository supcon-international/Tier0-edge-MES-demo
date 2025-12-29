import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DATE_FMT_TEXT = "YYYY-MM-DD"
export const TIME_FMT_TEXT = "YYYY-MM-DD HH:mm:ss"

export const formatDate = (val?: string | number) =>
  val ? dayjs(val).format(DATE_FMT_TEXT) : undefined

export const formatDateTime = (val?: string | number) =>
  val ? dayjs(val).format(TIME_FMT_TEXT) : undefined

