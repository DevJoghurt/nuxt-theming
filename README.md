# Nuxt Theming

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Tailwind based global theming for Nuxt 3.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

  - Minimal and small with no direct dependencies and fully tree shakeable
  - simply create global themes for your application based on Tailwind CSS
  - Use it to build your own custom extandable component library

## Quick Setup

1. Add `nuxt-theming` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-theming

# Using yarn
yarn add --dev nuxt-theming

# Using npm
npm install --save-dev nuxt-theming
```

2. Add `my-module` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-theming'
  ]
})
```

That's it! You can now use Nuxt Theming in your app ✨

## First steps

### 1. Create a theme file
Create a folder named theme and add a JSON, TypeScript (ts), or JavaScript (js) file to it. Follow the naming convention [theme type].[optional theme variation].[json/ts/js], for example, button.json or button.admin.json.

### 2. Add a theme config
A theme config comprises five categories: 
`base`, `defaults`, `variants`, `options` and `presets`.
```json
{
    "base": {
        "button": "focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0",
        "label": "",
        "icon": "flex-shrink-0"
    },
    "defaults": {
        "button": "shadow-sm text-white dark:text-gray-900 bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-{color}-400 dark:hover:bg-{color}-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400"
    },
    "variants": {
        "light": {
            "button": "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-{color}-100 dark:bg-{color}-900 hover:bg-{color}-200 disabled:bg-{color}-50 dark:hover:bg-{color}-800 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-gray-500 dark:focus-visible:ring-gray-400"
        },
        "outline": {
            "button": "ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400"
        },
        "soft": {
            "button": "text-{color}-500 dark:text-{color}-400 bg-{color}-50 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-950 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400"
        },
        "ghost": {
            "button": "text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400"
        },
        "link": {
            "button": "text-{color}-500 hover:text-{color}-600 disabled:text-{color}-500 dark:text-{color}-400 dark:hover:text-{color}-500 dark:disabled:text-{color}-400 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400"
        }
    },
    "options": {
        "size": {
            "2xs": "text-xs",
            "xs": "text-xs",
            "sm": "text-sm",
            "md": "text-sm",
            "lg": "text-sm",
            "xl": "text-base"
          },
          "gap": {
            "2xs": "gap-x-1",
            "xs": "gap-x-1.5",
            "sm": "gap-x-1.5",
            "md": "gap-x-2",
            "lg": "gap-x-2.5",
            "xl": "gap-x-2.5"
          }
    },
    "presets": {
        "color": "primary",
        "loadingIcon": "i-heroicons-arrow-path-20-solid",
        "size": "md",
        "rounded": "md",
        "shadow": "none"
    }
}
```

### 3. Implement the theme

```js
  // use the auto imported theme
  const buttonTheme = computed(() => useTheme('button', {
      variation: 'default|admin',
      variant: 'default',
      overwrite: props.ui,
      extractors: {
          color: props.color
      }
  }))

  console.log(theme('button', {
      size: 'md',
      gap: 'sm',
  }))

```


## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

# Credits

- Inspired by Nuxt UI (@benjamincanac)

## License

[MIT License](./LICENSE)

Copyright (c) DevJoghurt

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-theming/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-theming

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-theming.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-theming

[license-src]: https://img.shields.io/npm/l/nuxt-theming.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-theming

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
