<template>
  <div>
    Nuxt module playground!
  </div>
</template>
<script setup lang="ts">
  const { classes } = useTheme('input', {
    theme: {
      variation: "defaultTheme"
    },
    overwrite: {
      options: {
        size: {}
      }
    }
  })
  console.log(classes('base'))
</script>
