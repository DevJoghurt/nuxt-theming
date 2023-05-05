import { createUnplugin } from 'unplugin'
import { addVitePlugin } from '@nuxt/kit'

import type { ThemeConfig } from './types'

type ThemeImportOptions = {
  allowedTypes: string[]
}

export async function extendBundler(textsConfig: ThemeConfig[]) {
    //create array of allowed types for useTexts
    const allowedTypes = textsConfig.map((config) => {
      return config.name
    })  
    addVitePlugin(ThemeImportPlugin.vite({
      allowedTypes: allowedTypes
    }))
}

const ThemeImportPlugin = createUnplugin((options: ThemeImportOptions, meta) => {
    return {
        name: 'theme-import',
        enforce: 'pre',
        async transform(code, id) {
          if (!code.includes('useTheme')) {
              return null;
          }

          let autoImportAdded = false as boolean;
          const updatedCode = code.replace(
            /useTheme\(([^,]*?)(?:,\s*({(?:[^{}]*|\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})*}))?\)/g, 
            (match, arg1, arg2) => {
              console.log(arg1, arg2)
            const phrase = arg1.slice(1, -1)
            if(options.allowedTypes.includes(phrase)){
              autoImportAdded = true
              return `useTheme('${phrase}'${arg2 ? ', ' + arg2.trim() : ',{} '}, ${phrase}Theme)`
            }else{
              return match
            }
          })          
        
          if (autoImportAdded) {
            return {
              code: updatedCode ,
              map: null,
            };
          }
      
          return null;
        }
    }
})