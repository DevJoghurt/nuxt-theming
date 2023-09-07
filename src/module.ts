import { defineNuxtModule, createResolver, addImports } from '@nuxt/kit'
import { scanThemeFiles, createThemeConfig, orderThemeDirsByPriority} from './utils'
import { writeTypes, writeTemplates } from './template' 
import { resolve } from 'path'
import { extendBundler } from './bundler'
import type { ModuleOptions, ThemeConfig, ThemeDir } from './types'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'theme:extend': (themeDirs: ThemeDir[]) => void;
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-theming',
    configKey: 'theming'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    dir: 'theme',
    variations: [],
    layers: {
      overwriteTypes: false,
      priority: 0
    }
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)


    const themeConfig = [] as ThemeConfig[]
    let themeDirs = [] as ThemeDir[]

    nuxt.options.alias['#theme'] = `${nuxt.options.buildDir}/types/theme`

    // Support `extends` directories
    if (nuxt.options._layers && nuxt.options._layers.length > 1) {
      interface NuxtLayer {
        config: any
        configFile: string
        cwd: string
      }

      // nuxt.options._layers is from rootDir to nested level
      // We don't need to reverse the order because we are using `defu` for merging
      const layers = (nuxt.options._layers as NuxtLayer[]).slice()
      
      for (const layer of layers) {
        themeDirs.push({
          cwd: layer.cwd,
          dir: layer.config.theme?.dir || options.dir,
          priority: layer.config.theme?.layers?.priority || 0
        })
      }
    }else{
      themeDirs.push({
        cwd: nuxt.options.rootDir,
        dir: options.dir,
        priority: options.layers?.priority || 0
      })
    }

    // Allow extending themes config by other modules - they will be prepended
    // @ts-ignore
    await nuxt.callHook('theme:extend', themeDirs)

    //order themeDirs, if priority is highest it should be first -> this is important for handling types correctly
    themeDirs = orderThemeDirsByPriority(themeDirs)

    // create themes config
    for (const themeDir of themeDirs) {
      const files = await scanThemeFiles(themeDir.cwd, themeDir.dir)
      // add files to textsConfig
      createThemeConfig(themeConfig, files)
    }

    writeTypes(themeConfig, options)
    writeTemplates(themeConfig, options)

    // add theme imports to nuxt
    for(const c of themeConfig){
      addImports([{
        from: resolve(nuxt.options.buildDir, `theme/${c.name}`),
        as: `${c.name}Theme`,
        name: 'default',
        priority: 100
      }])
    }

    extendBundler(themeConfig)

    addImports([{
      name: 'defineTheme',
      from: resolver.resolve('./runtime/composables/defineTheme')
    },{
      name: 'useTheme',
      from: resolver.resolve('./runtime/composables/useTheme')
    },{
      name: 'createTheme',
      from: resolver.resolve('./runtime/composables/createTheme')
    }])
  }
})