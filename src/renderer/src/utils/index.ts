import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化时间（秒转换为 mm:ss 格式）
 * @param time 时间（秒）
 * @returns 格式化后的时间
 */
export const formatTime = (time?: number) => {
  if (!time) return '00:00';

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
};
