<template>
  <div class="flex flex-col items-center justify-center py-16 px-8 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
    <div class="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center mb-4">
      <UiIcon :name="icon" class="!w-7 !h-7 text-pink-300" />
    </div>
    <p class="text-[14px] font-semibold text-pink-600 mb-1 text-center">{{ title }}</p>
    <p class="text-[12px] text-pink-400/70 text-center leading-relaxed">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon: string
  title: string
  description: string
}>(), {})
</script>
