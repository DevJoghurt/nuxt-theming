import type { ThemeTypes, ThemeConfigs, Themes, ThemeVariations } from '#build/types/theme'
import type { Theme } from '../types'
import { createTheme } from './createTheme'

export type UseThemeOptions<T extends ThemeTypes> = {
    theme?: ThemeVariations
    variant?: Themes[T]["variants"] | null
    overwrite?: ThemeConfigs[T]['base']
    merge?: (base: string, overwrite: string) => string
}

export type AutoImportedThemes<T extends ThemeTypes> = {
    [ key in ThemeVariations ]: Theme<Themes[T]>
}

export function useTheme<T extends ThemeTypes>(themeType: T, themeOptions: UseThemeOptions<T> = {} as UseThemeOptions<T>, theme: AutoImportedThemes<T> = {} as AutoImportedThemes<T>) {
    if(!themeType) throw new Error('Theme Type is required')

    const { classes } = createTheme<Themes[T]>(theme, themeOptions)

    return {
        classes
    }
}