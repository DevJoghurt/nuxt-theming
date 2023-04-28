import { addTemplate } from '@nuxt/kit'
import type { NuxtTemplate } from '@nuxt/schema'
import { resolvePath } from 'mlly'
import type { TextsConfig, LanguageCode } from './types'

  export function writeTypes(config: TextsConfig[], locales: LanguageCode[]){
    // write text types
    const template: NuxtTemplate = {
      filename: `types/texts.d.ts`,
      getContents: async () => {
        return `import type { Defu } from 'defu'
export type LanguageCode = ${locales.map((l) => `'${l}'`).join(' | ')}
export type TextTypes = ${config.length > 0 ? config.map((c) => `'${c.name}'` ).join(' | ') : 'empty'}
${config.map((c) => c.paths.map((file, index) => `import ${`l${index}_${c.name}`} from '${file}'`).join('\n')).join('\n')}
${config.map((c) => `export type ${c.name} = Defu<typeof l0_${c.name}, [${c.paths.slice(1).map((file, index) => `typeof l${index+1}_${c.name}`).join(', ')}]>`).join('\n')}
export type ResolvedTexts = {
  ${config.length > 0 ? config.map((c) => `${c.name}: ${c.name}`).join('\n') : 'empty: \'\''}
}`
      }
    }
    addTemplate(template)
  }

  export function writeTemplates(config: TextsConfig[], textsDefaultLocale: LanguageCode){
    // write config
    for(const c of config){
      const template: NuxtTemplate = {
        filename: `texts/${c.name}.ts`,
        write: true,
        getContents: async () => {
          return `import { defu } from '${await _resolveId('defu')}'
${c.paths.map((file, index) => `import ${`l${index}_${c.name}_default`} from '${file}'`).join('\n')}
${c.locales.map((locale) => locale.paths.map((file, index) => `import ${`l${index}_${c.name}_${locale.languageCode}`} from '${file}'`).join('\n')).join('\n')}
const defaultTexts = defu(${c.paths.map((file, index) => `l${index}_${c.name}_default`).join(', ')})
${c.locales.map((locale) => `const ${locale.languageCode} = defu(${locale.paths.map((file, index) => `l${index}_${c.name}_${locale.languageCode}`).join(', ')}, defaultTexts)`).join('\n')}
const texts = {
  '${textsDefaultLocale}': defaultTexts
}
${c.locales.map((locale) => `texts['${locale.languageCode}'] = ${locale.languageCode}`).join('\n')}
export default texts`
        }
      }
      addTemplate(template)
    } 

  }

  function _resolveId (id: string) {
    return resolvePath(id, {
      url: [
        // @ts-ignore
        global.__NUXT_PREPATHS__,
        import.meta.url,
        process.cwd(),
        // @ts-ignore
        global.__NUXT_PATHS__
      ]
    })
  }