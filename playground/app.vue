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
