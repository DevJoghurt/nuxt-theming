import { createUnplugin } from 'unplugin'
import { addVitePlugin } from '@nuxt/kit'

import type { TextsConfig, TextsImportOptions } from './types'

export async function extendBundler(textsConfig: TextsConfig[]) {
    //create array of allowed types for useTexts
    const allowedTypes = textsConfig.map((config) => {
      return config.name
    })  
    addVitePlugin(TextsImportPlugin.vite({
      allowedTypes: allowedTypes
    }))
}

const TextsImportPlugin = createUnplugin((options: TextsImportOptions, meta) => {
    return {
        name: 'texts-import',
        enforce: 'pre',
        async transform(code, id) {
          if (!code.includes('useTexts')) {
              return null;
          }

          let autoImportAdded = false as boolean;

          const updatedCode = code.replace(/useTexts\(((?:[^,'"`\(\)]|`[^`]*`|'[^']*'|"[^"]*")*)(?:,\s*({(?:[^{}'`"\(\)]|`[^`]*`|'[^']*'|"[^"]*")*}))?\)/g, (match, arg1, arg2) => {
            const phrase = arg1.slice(1, -1)
            if(options.allowedTypes.includes(phrase)){
              autoImportAdded = true
              return `useTexts('${phrase}', ${phrase}Texts${arg2 ? ', ' + arg2.trim() : ''})`
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