import { twMerge } from 'tailwind-merge'

export function mergeTheme(originalClasses: string, overwriteClasses: string) {
    return twMerge(originalClasses, overwriteClasses)
}