import type { ThemeTypes, ThemeConfigs, Themes, ThemeVariations, DeepPartial } from '#build/types/theme'
import type { Theme } from '../types'
import { createTheme } from './createTheme'

export type UseThemeOptions<T extends ThemeTypes> = {
    theme?: ThemeVariations
    variant?: Themes[T]["variants"] | null
    extractors?: Record<string, string | undefined>
    overwrite?: Partial<{ [P in keyof Record<Themes[T]["keys"], string>]: string}>
}

export type AutoImportedThemes<T extends ThemeTypes> = {
    [ key in ThemeVariations ]: Theme<Themes[T]>
}

export type KeysOptions<T extends ThemeTypes> = {
    [P in keyof Themes[T]["options"]]: DeepPartial<keyof NonNullable<Themes[T]["options"][P]>>
}

export type UseThemeResult<T extends ThemeTypes> = (
    key: Themes[T]["keys"] | `preset:${Themes[T]["presets"]}`,
    options?: KeysOptions<T>,      
    prependClasses?: string | string[] | null | undefined | unknown
) => string;

export function useTheme<T extends ThemeTypes>(themeType: T, themeOptions: UseThemeOptions<T> = {} as UseThemeOptions<T>, theme: AutoImportedThemes<T> = {} as AutoImportedThemes<T>) : UseThemeResult<T> {
    if(!themeType) throw new Error('Theme Type is required')

    return createTheme<Themes[T]>(theme, themeOptions)
}