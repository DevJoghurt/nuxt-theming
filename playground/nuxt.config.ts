const colors = require('tailwindcss/colors')

export default defineNuxtConfig({
  devtools: true,
  modules: [
    '~/modules/test/module',
    '../src/module'
  ],
  theming: {
    variations: ['admin', 'app'],
    layers: {
      priority: 100
    },
    config: [
      {
        name: 'button',
        safelistExtractors:{ 
          color: {
            component: 'FsButton',
            safelistByProp: true,
            values: ['primary']
          }
        }
      },
      {
        name: 'input',
        safelistExtractors:{ 
          color: {
            component: 'FsInput',
            safelistByProp: true,
            values: ['primary']
          }
        }
      }
    ]
  },
  tailwindcss: {
    viewer: true,
    config: {
      theme: {
        extend: {
          colors: {
            // Set your primary color
            primary: colors.zinc, 
          },
        },
      },
      content:{
        files: [
          'playground/theme/**/**.{ts,js,json}',
          'playground/theme-extend/**/**.{ts,js,json}'
        ]
      }
    }
  }
})
