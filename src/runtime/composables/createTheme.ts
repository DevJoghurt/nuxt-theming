import type { ThemeSchema, Theme, DeepPartial } from '../types'
import { mergeTheme } from '#imports'

export type ThemeVariation = 'default' | string

export type ThemeOptions<T extends ThemeSchema> = {
  theme?: ThemeVariation
  variant?: T["variants"] | null
  extractors?: Record<string, string | undefined>
  overwrite?: Theme<T>["base"]
}

export type Themes<T extends ThemeSchema> = {
    [ key in ThemeVariation ]: Theme<T>
}

export type KeysOptions<T extends ThemeSchema> = {
  [P in keyof T["options"]]: DeepPartial<keyof NonNullable<T["options"][P]>>
}

export type CreateThemeResult<T extends ThemeSchema> = (
      key: T["keys"] | `preset:${T["presets"]}`,
      options?: KeysOptions<T>,
      prependClasses?: string | string[] | null | undefined | unknown
) => string;

export function createTheme<T extends ThemeSchema>(theme: Themes<T>, themeOptions: ThemeOptions<T> = {} as ThemeOptions<T>): CreateThemeResult<T> {
    const variation = themeOptions?.theme || 'default'
    const currentTheme = theme[variation] || theme['default'] // fallback
    
    /**
    * theme handler
    */
    const handler = (key: T["keys"] | `preset:${T["presets"]}`, options: KeysOptions<T> = {} as KeysOptions<T>, prependClasses: string | string[] | null | undefined | unknown = null) => {
      //check if key is a preset 'preset:key' and return preset value directly
      if(key.includes(':')){
        const [, presetKey] = key.split(':') as [string, T["presets"]]
        if(typeof currentTheme.presets !== 'undefined' && typeof currentTheme.presets[presetKey] !== 'undefined'){
          const presetValue = currentTheme.presets[presetKey] as string
          return presetValue || ''
        }
      }
      // Add classes from base
      const baseClasses = (currentTheme.base[key] ?? "") as string
      const generatedClasses = baseClasses.split(' ')
      //Add classes from variants or defaults
      if(themeOptions?.variant && themeOptions?.variant !== 'default'){
        const themeVariants = (typeof currentTheme.variants !== 'undefined') ? currentTheme?.variants[themeOptions?.variant] : {} as Record<T["keys"], string>
        if(themeVariants && typeof themeVariants[key] !== 'undefined'){
          const variantClasses = (themeVariants[key] ?? '') as string
          generatedClasses.push(...variantClasses.split(' '))
        }
      }else{
          const themeDefaults = currentTheme?.defaults ?? {} as Record<T["keys"], string>
          if(typeof themeDefaults[key] !== 'undefined'){
            const defaultClasses = (themeDefaults[key] ?? '') as string
            generatedClasses.push(...defaultClasses.split(' '))
          }
      }
      // Add classes from options
      const optionEntries = Object.entries(options) as [keyof KeysOptions<T>, DeepPartial<keyof NonNullable<T["options"][keyof T["options"]]> | undefined>][]
      for(const [option, value] of optionEntries){
        if(currentTheme?.options && value){
            const optionClasses = (typeof currentTheme?.options[option] !== 'undefined') ? (currentTheme?.options[option][value] ?? '') as string : null
            if(optionClasses){
                generatedClasses.push(...optionClasses.split(' '))
            }
        }
      }

      let combinedClasses = generatedClasses.join(' ')

      // overwrite classes
      if(themeOptions?.overwrite && typeof themeOptions?.overwrite[key] !== 'undefined'){
        const overwriteClasses = themeOptions.overwrite[key] as string
        if(overwriteClasses !== ''){
          combinedClasses = mergeTheme(combinedClasses, overwriteClasses)
        }
      }
      // replace based on extractors
      if(themeOptions?.extractors){
        for(const [key, value] of Object.entries(themeOptions?.extractors)){
          if(value) combinedClasses = combinedClasses.replace(new RegExp(`{${key}}`, 'g'), value)
        }
      }

      if(prependClasses){
        if(Array.isArray(prependClasses)){
          combinedClasses = [...prependClasses, combinedClasses].join(' ')
        }else{
          combinedClasses = [prependClasses, combinedClasses].join(' ')
        }
      }

      return combinedClasses
    }

    return handler
}