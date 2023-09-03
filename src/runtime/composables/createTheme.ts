import type { ThemeSchema, Theme, DeepPartial } from '../types'

export type ThemeVariation = 'default' | string

export type ThemeOptions<T extends ThemeSchema> = {
  theme?: ThemeVariation
  variant?: T["variants"] | null
  params?: Record<string, string>
  overwrite?: Theme<T>['base']
  merge?: (base: string, overwrite: string) => string
}

export type Themes<T extends ThemeSchema> = {
    [ key in ThemeVariation ]: Theme<T>
}

export type ClassesOptions<T extends ThemeSchema> = {
    [P in keyof T["options"]]: DeepPartial<keyof NonNullable<T["options"][P]>>
}

export type CreateThemeResult<T extends ThemeSchema> = (
      key: T["classes"],
      options?: ClassesOptions<T>
) => string;

export function createTheme<T extends ThemeSchema>(theme: Themes<T>, themeOptions: ThemeOptions<T> = {} as ThemeOptions<T>): CreateThemeResult<T> {
    const variation = themeOptions?.theme || 'default'
    const currentTheme = theme[variation] || theme['default'] // fallback
    
    /**
    * generate classes
    */
    const generateClasses = (key: T["classes"], options: ClassesOptions<T> = {} as ClassesOptions<T>) => {

      // Add classes from base
      const baseClasses = (currentTheme.base[key] ?? "") as string
      const generatedClasses = baseClasses.split(' ')
      //Add classes from variants or defaults
      if(themeOptions?.variant && themeOptions?.variant !== 'default'){
        const themeVariants = (typeof currentTheme.variants !== 'undefined') ? currentTheme?.variants[themeOptions?.variant] : {} as Record<T["classes"], string>
        if(themeVariants && typeof themeVariants[key] !== 'undefined'){
          const variantClasses = (themeVariants[key] ?? '').split(' ')
          generatedClasses.push(...variantClasses)
        }
      }else{
          const themeDefaults = currentTheme?.defaults ?? {} as Record<T["classes"], string>
          if(typeof themeDefaults[key] !== 'undefined'){
            const defaultClasses = (themeDefaults[key] ?? '') as string
            generatedClasses.push(...defaultClasses.split(' '))
          }
      }
      // Add classes from options
      for(const [option, value] of Object.entries(options)){
        const themeOptions = currentTheme?.options ?? {}
        if(themeOptions && value){
            // @ts-ignore
            const optionClasses = (typeof themeOptions[option] !== 'undefined') ? (themeOptions[option][value] ?? '').split(' ') : null
            if(optionClasses){
                generatedClasses.push(...optionClasses)
            }
        }
      }

      let combinedClasses = generatedClasses.join(' ')

      // overwrite classes
      if(typeof themeOptions.overwrite !== "undefined" && typeof themeOptions.overwrite[key] !== 'undefined'){
        const overwriteClasses = themeOptions.overwrite[key] as string
        if(overwriteClasses !== '' && themeOptions?.merge && typeof themeOptions.merge === 'function'){
          combinedClasses = themeOptions.merge(combinedClasses, overwriteClasses)
        }else if(overwriteClasses !== ''){
          combinedClasses = overwriteClasses
        }
      }

      if(themeOptions?.params){
        for(const [key, value] of Object.entries(themeOptions?.params)){
          combinedClasses = combinedClasses.replace(new RegExp(`{${key}}`, 'g'), value)
        }
      }

      return combinedClasses
    }

    return generateClasses
}