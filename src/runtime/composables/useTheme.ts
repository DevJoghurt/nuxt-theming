import type { ThemeTypes, ThemeConfigs, Themes } from '#build/types/theme'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

type ThemeOptions = {
  variation?: Themes
}

type UseThemeOptions<T extends ThemeTypes> = {
    theme?: ThemeOptions
    variant?: Extract<keyof NonNullable<ThemeConfigs[T]["variants"]>, string>
    overwrite?: {
      base?: DeepPartial<ThemeConfigs[T]['base']>
      defaults?: DeepPartial<ThemeConfigs[T]['base']>
      variants?: DeepPartial<ThemeConfigs[T]['variants']>
      props?: {
        [P in keyof NonNullable<ThemeConfigs[T]["props"]>]: DeepPartial<Record<keyof NonNullable<ThemeConfigs[T]["props"][P]>, string>>
      }
    }
}

export interface UseThemeResult<T extends ThemeTypes> {
    classes: (
      key: Extract<keyof ThemeConfigs[T]["base"], string>
    ) => string;
}

export function useTheme<T extends ThemeTypes>(themeType: T, options: UseThemeOptions<T> = {} as UseThemeOptions<T>, config: Record<Themes, ThemeConfigs[T]> = {} as Record<Themes, ThemeConfigs[T]>): UseThemeResult<T> {
    const theme = 'defaultTheme'
    const currentTheme = config[theme] || config['defaultTheme'] // fallback
    
    const classes = (key: Extract<keyof ThemeConfigs[T]["base"], string>) => {
      
      console.log('test', currentTheme)
        // TODO: find out how to solve TS error
        // @ts-ignore
        const baseClasses = (currentTheme?.base[key] ?? '').split(' ')
        console.log(baseClasses)


        return baseClasses.join(' ')
    }

    return {
        classes
    }
}