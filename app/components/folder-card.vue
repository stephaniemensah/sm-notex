<template>
  <NuxtLink
    :to="to"
    class="group block rounded-2xl border border-[#E7E5E4] bg-white overflow-hidden transition-all duration-200 hover:border-[#D6D3D1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98]"
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
      <p class="text-[11px] text-[#A8A29E]">{{ count }} {{ count === 1 ? 'note' : 'notes' }}</p>
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
