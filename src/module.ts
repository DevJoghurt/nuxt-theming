import { defineNuxtModule, createResolver, addImports, installModule } from '@nuxt/kit'
import { scanThemeFiles, createThemeConfig, orderThemeDirsByPriority, createSafelists} from './theme'
import { writeThemeTypes, writeThemeTemplates } from './template' 
import { resolve } from 'path'
import { extendBundler } from './bundler'
import { defu } from 'defu'
import type { ModuleOptions, ThemeConfig, ThemeDir, ThemeExtendedConfig, SafelistConfig } from './types'
import { installTailwindModule } from './tailwind'
import { convertComponentName } from './utils'

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
    mergeStrategy: 'tailwind-merge',
    config: [],
    layers: {
      overwriteTypes: false,
      priority: 0
    }
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const themeConfigs = [] as ThemeConfig[]
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
    await nuxt.callHook('theme:extend', themeDirs)

    //order themeDirs, if priority is highest it should be first -> this is important for handling types correctly
    themeDirs = orderThemeDirsByPriority(themeDirs)

    // create themes config
    for (const themeDir of themeDirs) {
      const files = await scanThemeFiles(themeDir.cwd, themeDir.dir)
      // add files to themeConfig
      createThemeConfig(themeConfigs, files)
    }

    const safelistConfig = {
      global: [],
      components: {},
      componentWhitelist: []
    } as SafelistConfig

    // theme config is now complete, we can now add the fileConfig and use it
    for(const c of themeConfigs){
      // there can be multiple fileConfigs for one file, because of nuxt layers
      //TODO: check how layering works internally for this fileConfig
      const fileConfigs = options?.config.filter((f)=>f.name === c.name)
      if(fileConfigs.length > 0){
        const fileConfig = defu({}, ...fileConfigs) as ThemeExtendedConfig
        //parse safelistExtractors for tailwind
        c.safelists = await createSafelists(c.files, fileConfig)
        // create global safelist for tailwind config
        if(c.safelists.length > 0){
          for(const safelist of c.safelists){
            const safelistClasses = [...safelist.classes.map((classEl) => safelist.values.map((value) => classEl.replace(new RegExp(`{${safelist.extractor}}`, 'g'), value))).flat()]
            // merge safelist classes without duplicates
            safelistConfig.global = [...new Set([...safelistConfig.global, ...safelistClasses ])]
            // add classes to component safelist if safelistByProp is true
            if(safelist.component && safelist.classes.length > 0){
              if(!safelistConfig.components[safelist.component]){
                safelistConfig.components[safelist.component] = []
              }
              safelistConfig.components[safelist.component].push({
                classes: safelist.classes,
                extractor: safelist.extractor
              })
              //create component whitelist for tailwind config
              safelistConfig.componentWhitelist = [...new Set([...safelistConfig.componentWhitelist, ...convertComponentName(safelist.component) ])]

            }
          }
        }
      }

      // add imports to nuxt to support auto import of theme types by composable useTheme
      addImports([{
        from: resolve(nuxt.options.buildDir, `theme/${c.name}`),
        as: `${c.name}Theme`,
        name: 'default',
        priority: 100
      }])
    }

    // 
    nuxt.hook('tailwindcss:resolvedConfig', (tailwindConfig)=>{
      const globalColors: any = {
        ...(tailwindConfig.theme?.colors || {}),
        ...tailwindConfig.theme?.extend?.colors
      }

      const colors = Object.keys(globalColors).filter(key => {
        const excludedColors = ['black', 'white', 'inherit', 'current', 'transparent'];
        return !excludedColors.includes(key);
      })

      writeThemeTypes(themeConfigs, colors, options)
      writeThemeTemplates(themeConfigs, colors, options)

      addImports([{
        from: resolve(nuxt.options.buildDir, 'theme/_colors.ts'),
        as: 'tailwindColors',
        name: 'default',
        priority: 100
      }])
    })

    await installTailwindModule(nuxt, safelistConfig)


    extendBundler(themeConfigs)

    const imports = [{
      name: 'defineTheme',
      from: resolver.resolve('./runtime/composables/defineTheme')
    },{
      name: 'useTheme',
      from: resolver.resolve('./runtime/composables/useTheme')
    },{
      name: 'createTheme',
      from: resolver.resolve('./runtime/composables/createTheme')
    }]

    if(options.mergeStrategy === 'tailwind-merge'){
      imports.push({
        name: 'mergeTheme',
        from: resolver.resolve('./runtime/merger/twmerge'),
      })
    }
    if(options.mergeStrategy === 'overwrite'){
      imports.push({
        name: 'mergeTheme',
        from: resolver.resolve('./runtime/merger/overwrite'),
      })
    }

    addImports(imports)
  }
})