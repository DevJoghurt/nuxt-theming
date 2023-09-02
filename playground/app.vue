<template>
  <div class="p-10 dark:bg-gray-800">
    Nuxt module playground!
    <FsButton
      label="Button"
      :loading="loading"
      :disabled="loading"
      size="sm"
    />
    <FsButton
      label="Toggle Loading"
      size="lg"
      :overwrite="{
        button: 'dark:bg-red-500 hover:bg-red-600'
      }"
      @click="toggleLoading"
    />
  </div>
</template>
<script setup lang="ts">

  const loading = ref(false)

  const toggleLoading = () => {
    loading.value = !loading.value
  }
</script>
