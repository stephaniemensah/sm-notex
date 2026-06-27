<template>
  <span
    :class="[
      'inline-flex items-center gap-1 font-medium rounded-full',
      variant === 'colored'
        ? ''
        : variant === 'dark'
          ? 'bg-gray-900/90 text-white px-2 py-0.5 text-[11px]'
          : variant === 'glass'
            ? 'bg-black/[0.04] text-gray-600 px-2 py-0.5 text-[11px] border border-black/[0.04]'
            : 'bg-black/[0.04] text-gray-500 px-2 py-0.5 text-[11px]',
    ]"
    :style="variant === 'colored' ? { backgroundColor: color + '18', color: color, padding: '2px 8px', fontSize: '11px' } : undefined"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'colored' | 'dark' | 'glass'
  color?: string
}>(), {
  variant: 'default',
  color: '#3B82F6',
})
</script>
