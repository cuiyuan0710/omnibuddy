import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并组件传入的 Tailwind 类名，并消除相互覆盖的工具类。
 * @param inputs 组件基础类名与调用方附加的类名。
 * @returns 合并后的类名字符串。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
