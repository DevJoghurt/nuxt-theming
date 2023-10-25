<template>
  <div class="p-10 dark:bg-gray-800">
    Nuxt module playground!
    <FsButton
      label="Button"
      :loading="loading"
      :disabled="loading"
      color="fuchsia"
      size="sm"
    />
    <FsButton
      label="Toggle Loading"
      size="md"
      :ui="{
        button: 'dark:bg-red-500 hover:bg-red-600'
      }"
      @click="toggleLoading"
    />
    <FsInput />
  </div>
</template>
<script setup lang="ts">

  const loading = ref(false)

  const toggleLoading = () => {
    loading.value = !loading.value
  }

  const theme = useTheme('input', {
    overwrite: {
      icon: 'text-gray-500 dark:text-gray-400'
    }
  })

  theme('input', {
    gap: 'lg'
  })

  console.log(theme('preset:loadingIcon'))

</script>
