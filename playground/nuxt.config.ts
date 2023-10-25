const colors = require('tailwindcss/colors')

export default defineNuxtConfig({
  modules: [
    '~/modules/test/module',
    '../src/module',
    '@nuxtjs/tailwindcss'
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
    config: {
      theme: {
        extend: {
          colors: {
            // Set your primary color
            primary: colors.indigo, 
          },
        },
      },
      content: [
        'playground/theme/**/**.{ts,js,json}',
        'playground/theme-extend/**/**.{ts,js,json}'
      ]
    }
  }
})
