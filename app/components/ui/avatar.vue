<template>
  <div
    v-if="imageUrl"
    class="flex-shrink-0 rounded-full overflow-hidden ring-1 ring-black/[0.06]"
    :class="sizeClasses"
  >
    <img :src="imageUrl" :alt="name" class="w-full h-full object-cover" />
  </div>
  <div
    v-else
    class="flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold ring-1 ring-black/[0.06]"
    :class="[sizeClasses, bgClass]"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  imageUrl?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>(), {
  size: 'sm',
  imageUrl: undefined,
})

const initials = computed(() => {
  if (!props.name) return 'U'
  return props.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-4 h-4 text-[8px]'
    case 'sm': return 'w-5 h-5 text-[9px]'
    case 'md': return 'w-8 h-8 text-[11px]'
    case 'lg': return 'w-16 h-16 text-lg'
  }
})

const bgClass = computed(() => {
  const colors = ['from-blue-400 to-blue-600', 'from-violet-400 to-violet-600', 'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600', 'from-rose-400 to-rose-600', 'from-cyan-400 to-cyan-600']
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `bg-gradient-to-br ${colors[Math.abs(hash) % colors.length]}`
})
</script>
