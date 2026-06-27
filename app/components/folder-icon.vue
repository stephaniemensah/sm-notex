<template>
  <UiIcon :name="name" class="w-full h-full" />
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>
