import type { ThemeTypes, ThemeConfigs, Themes, ThemeVariations, DeepPartial } from '#build/types/theme'
import type { Theme } from '../types'
import { createTheme } from './createTheme'

export type UseThemeOptions<T extends ThemeTypes> = {
    theme?: ThemeVariations
    variant?: Themes[T]["variants"] | null
    overwrite?: ThemeConfigs[T]['base']
    params?: Record<string, string>
    merge?: (base: string, overwrite: string) => string
}

export type AutoImportedThemes<T extends ThemeTypes> = {
    [ key in ThemeVariations ]: Theme<Themes[T]>
}

export type ClassesOptions<T extends ThemeTypes> = {
    [P in keyof Themes[T]["options"]]: DeepPartial<keyof NonNullable<Themes[T]["options"][P]>>
}

export type UseThemeResult<T extends ThemeTypes> = (
    key: Themes[T]["classes"],
    options?: ClassesOptions<T>
) => string;

export function useTheme<T extends ThemeTypes>(themeType: T, themeOptions: UseThemeOptions<T> = {} as UseThemeOptions<T>, theme: AutoImportedThemes<T> = {} as AutoImportedThemes<T>) : UseThemeResult<T> {
    if(!themeType) throw new Error('Theme Type is required')

    return createTheme<Themes[T]>(theme, themeOptions)
}