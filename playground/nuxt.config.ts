export default defineNuxtConfig({
  modules: [
    '~/modules/test/module',
    '../src/module'
  ],
  theming: {
    variations: ['admin', 'app'],
    layers: {
      priority: 100
    }
  }
})
