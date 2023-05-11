const colors = require('tailwindcss/colors')

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '~/modules/test/module',
    '../src/module'
  ],
  theming: {
    variations: ['admin', 'app'],
    layers: {
      priority: 100
    }
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
