import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MONTH_FMT_TEXT = "YYYY-MM";
export const DATE_FMT_TEXT = "YYYY-MM-DD";
export const TIME_FMT_TEXT = "YYYY-MM-DD HH:mm:ss";
export const TIME_MINUTE_FMT = "YYYY-MM-DD HH:mm";

/**
 * 格式化日期
 * @param val 时间字符串
 * @returns 格式化后的日期时间字符串 YYYY-MM-DD
 */
export const formatDate = (val?: Date | string | number) => val ? dayjs(val).format(DATE_FMT_TEXT) : undefined;

/**
 * 格式化日期时间
 * @param val 时间字符串
 * @returns 格式化后的日期时间字符串 YYYY-MM-DD HH:mm:ss
 */
export const formatDateTime = (val?: Date | string | number) => val ? dayjs(val).format(TIME_FMT_TEXT) : undefined;

/**
 * 格式化日期时间（精确到分钟）
 * @param val 时间字符串
 * @returns 格式化后的日期时间字符串 YYYY-MM-DD HH:mm
 */
export const formatDateTimeMinute = (val?: string | number) => val ? dayjs(val).format(TIME_MINUTE_FMT) : undefined;

/**
 * 日期转时间戳
 * @param date 日期
 * @returns 时间戳
 */
export function dateToTimestamp(date: Date | string | number | undefined) {
    if (!date) return undefined;
    return dayjs(date).valueOf();
}
