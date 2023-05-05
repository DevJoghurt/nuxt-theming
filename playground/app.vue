<template>
  <div>
    Nuxt module playground!
  </div>
</template>
<script setup lang="ts">
 const { classes } = useTheme('input', {
    theme: {
      variation: 'admin'
    },
    variant: 'error',
    overwrite: {
      base: {

      },
      options: {
        size: {
          
        }
      }
    }
 })
  console.log(classes('base'))
</script>
