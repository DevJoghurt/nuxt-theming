import type { ThemeSchema, Theme } from '../types'

export function defineTheme<T extends ThemeSchema>(theme: Theme<T>): Theme<T> {
  return theme
}