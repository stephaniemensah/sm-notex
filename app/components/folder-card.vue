<template>
  <NuxtLink
    :to="to"
    class="group block rounded-2xl border border-white/50 bg-white/50 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:border-pink-200 hover:bg-white/70 hover:shadow-[0_4px_16px_rgba(244,114,182,0.1)] active:scale-[0.98]"
  >
    <div class="p-4">
      <div class="flex items-start justify-between mb-2.5">
        <h3 class="text-[13px] font-semibold text-[#1C1917] line-clamp-1 pr-2">{{ title }}</h3>
        <div
          class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
          :style="{ backgroundColor: color + '14', color: color }"
        >
          <FolderIcon :name="icon" class="!w-3.5 !h-3.5" />
        </div>
      </div>
      <p class="text-[11px] text-pink-400/70">{{ count }} {{ count === 1 ? 'note' : 'notes' }}</p>
    </div>
    <div
      class="h-1 w-full"
      :style="{ backgroundColor: color }"
    ></div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  title: string
  icon: string
  color: string
  count: number
}>()
</script>
