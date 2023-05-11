import type { ThemeTypes, ThemeConfigs, Themes } from '#build/types/theme'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]> & Partial<T[P]>
    : T[P];
};

type ThemeOptions = {
  variation?: Themes
}

type UseThemeOptions<T extends ThemeTypes> = {
    theme?: ThemeOptions
    variant?: Extract<keyof NonNullable<ThemeConfigs[T]["variants"]>, string> | null
    overwrite?: {
      base?: DeepPartial<ThemeConfigs[T]['base']>
      defaults?: DeepPartial<ThemeConfigs[T]['base']>
      variants?: DeepPartial<ThemeConfigs[T]['variants']>
      options?: {
        [P in keyof NonNullable<ThemeConfigs[T]["options"]>]: Record<keyof NonNullable<ThemeConfigs[T]["options"][P]>, string>
      }
    }
}

type ClassesConfig<T extends ThemeTypes> = {
  [P in keyof NonNullable<ThemeConfigs[T]["options"]>]?: keyof NonNullable<ThemeConfigs[T]["options"][P]>
}

export interface UseThemeResult<T extends ThemeTypes> {
    classes: (
      key: Extract<keyof ThemeConfigs[T]["base"], string>,
      config?: ClassesConfig<T>
    ) => string;
}

export function useTheme<T extends ThemeTypes>(themeType: T, options: UseThemeOptions<T> = {} as UseThemeOptions<T>, config: Record<Themes, ThemeConfigs[T]> = {} as Record<Themes, ThemeConfigs[T]>): UseThemeResult<T> {
    const theme = 'defaultTheme'
    const currentTheme = config[theme] || config['defaultTheme'] // fallback
    
    const classes = (key: Extract<keyof ThemeConfigs[T]["base"], string>, config: ClassesConfig<T> = {} as ClassesConfig<T>) => {

        // TODO: find out how to solve TS error
        // @ts-ignore
        const generatedClasses = options?.overwrite?.base[key] ? (options?.overwrite?.base[key] ?? '').split(' ') : (currentTheme?.base[key] ?? '').split(' ')

        if(options.variant ){
          // @ts-ignore
          const variant = options?.overwrite?.variants[options.variant] ? options.overwrite.variants[options.variant] : currentTheme?.variants[options.variant] ?? {}
          if(variant[key]){
            const variantClasses = (variant[key] ?? '').split(' ')
            generatedClasses.push(...variantClasses)
          }
        }else{
          // @ts-ignore
          const defaults = options?.overwrite?.defaults ? options.overwrite.defaults : currentTheme?.defaults ?? {}
          if(defaults[key]){
            const defaultClasses = (defaults[key] ?? '').split(' ')
            generatedClasses.push(...defaultClasses)
          }
        }

        for(const [option, value] of Object.entries(config)){
          if(value){
            // @ts-ignore
            let optionClasses = currentTheme?.options[option][value]
            // @ts-ignore
            if(options?.overwrite?.options && options?.overwrite?.options[option] && options?.overwrite?.options[option][value]){
              // @ts-ignore
              optionClasses = options.overwrite.options[option][value]
            }
            if(optionClasses && optionClasses !== ''){
              generatedClasses.push(optionClasses)
            }
          }
        }
        return generatedClasses.join(' ')
    }

    return {
        classes
    }
}