<template>
  <NuxtLink
    :to="to"
    class="group block rounded-2xl border border-[#E7E5E4] bg-white overflow-hidden transition-all duration-200 hover:border-[#D6D3D1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98]"
    :style="{ borderTopColor: accentColor + '40' }"
  >
    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-[13px] font-semibold text-[#1C1917] line-clamp-1 pr-2">{{ title || 'Untitled' }}</h3>
      </div>

      <div class="h-[60px] overflow-hidden mb-3">
        <div
          v-if="content"
          class="text-[11px] text-[#A8A29E] leading-relaxed line-clamp-3 [&_img]:hidden"
          v-html="content"
        ></div>
        <p v-else class="text-[11px] text-[#D6D3D1] italic">Empty note</p>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-[10px] text-[#D6D3D1] font-medium">{{ formattedDate }}</p>
        <div v-if="tags && tags.length > 0" class="flex gap-1">
          <span
            v-for="tag in tags.slice(0, 2)"
            :key="tag"
            class="text-[9px] px-1.5 py-0.5 rounded-md bg-[#F5F5F4] text-[#78716C] font-medium"
          >{{ tag }}</span>
        </div>
      </div>
    </div>

    <div
      class="h-[3px] w-full transition-all duration-200 opacity-0 group-hover:opacity-100"
      :style="{ backgroundColor: accentColor }"
    ></div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { tokens } from '~/utils/tokens'

const props = defineProps<{
  to: string
  title: string
  content: string
  tags: string[]
  updatedAt: number
  index: number
}>()

const accentColor = computed(() => {
  return tokens.color.note[props.index % tokens.color.note.length]
})

const formattedDate = computed(() => {
  return new Date(props.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  }).toUpperCase()
})
</script>
