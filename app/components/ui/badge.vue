<template>
  <span
    :class="[
      'inline-flex items-center gap-1 font-medium rounded-full',
      sizeClass,
      variantClass,
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'colored' | 'dark' | 'outline'
  color?: string
  size?: 'sm' | 'md'
}>(), {
  variant: 'default',
  color: '#7C3AED',
  size: 'sm',
})

const sizeClass = computed(() => {
  return props.size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'dark':
      return 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
    case 'colored':
      return ''
    case 'outline':
      return 'border border-pink-200 text-pink-500'
    default:
      return 'bg-white/50 backdrop-blur-sm text-pink-500 border border-white/30'
  }
})

const dynamicStyle = computed(() => {
  if (props.variant === 'colored') {
    return {
      backgroundColor: props.color + '14',
      color: props.color,
    }
  }
  return undefined
})
</script>
