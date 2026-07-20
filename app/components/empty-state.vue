<template>
  <div class="flex flex-col items-center justify-center py-16 px-8">
    <div class="w-14 h-14 rounded-2xl bg-[#F5F5F4] flex items-center justify-center mb-4">
      <UiIcon :name="icon" class="!w-7 !h-7 text-[#D6D3D1]" />
    </div>
    <p class="text-[14px] font-semibold text-[#1C1917] mb-1 text-center">{{ title }}</p>
    <p class="text-[12px] text-[#A8A29E] text-center leading-relaxed">{{ description }}</p>
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
