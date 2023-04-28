import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { scanThemeFiles, createThemeConfig } from './utils'
import type { ThemeConfig } from './types'

// Module options TypeScript interface definition
export interface ModuleOptions {
  dir: string
}

type ThemeDir = {
  cwd: string
  dir: string
}  

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-theming',
    configKey: 'theme'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    dir: 'theme'
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)


    const themeConfig = [] as ThemeConfig[]
    const themeDirs = [] as ThemeDir[]

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
          dir: layer.config.theme?.dir || options.dir
        })
      }
    }else{
      themeDirs.push({
        cwd: nuxt.options.rootDir,
        dir: options.dir
      })
    }

    // Allow extending themes config config by other modules - they will be prepended
    // @ts-ignore
    await nuxt.callHook('theme:extend', themeDirs)

    // create themes config
    for (const themeDir of themeDirs) {
      const files = await scanThemeFiles(themeDir.cwd, themeDir.dir)
      // add files to textsConfig
      createThemeConfig(themeConfig, files)
    }


    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
