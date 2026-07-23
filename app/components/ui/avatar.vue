<template>
  <div
    v-if="imageUrl"
    class="flex-shrink-0 rounded-full overflow-hidden"
    :class="sizeClass"
  >
    <img :src="imageUrl" :alt="name" class="w-full h-full object-cover" />
  </div>
  <div
    v-else
    class="flex-shrink-0 rounded-full flex items-center justify-center font-semibold text-white"
    :class="[sizeClass, gradientClass]"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  imageUrl?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
  imageUrl: undefined,
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClass = computed(() => {
  const map = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  }
  return map[props.size]
})

const gradientClass = computed(() => {
  const gradients = [
    'bg-gradient-to-br from-pink-400 to-rose-500',
    'bg-gradient-to-br from-rose-400 to-pink-500',
    'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    'bg-gradient-to-br from-purple-400 to-pink-500',
    'bg-gradient-to-br from-pink-300 to-rose-400',
    'bg-gradient-to-br from-rose-300 to-fuchsia-400',
  ]
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
})
</script>
