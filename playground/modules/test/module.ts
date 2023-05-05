import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
    meta: {
      name: 'test-module',
      configKey: 'test',
      compatibility: {
        nuxt: '^3.0.0'
      }
    },
    defaults: {
    },
    async setup (options, nuxt) {
      //@ts-ignore
        nuxt.hook('theme:extend', (textsDirs)=>{
          textsDirs.unshift({
            cwd: nuxt.options.rootDir,
            dir: 'theme-extend',
            default: false
          })
        })
    }
})  