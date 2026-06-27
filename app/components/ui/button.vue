<template>
  <component
    :is="tag"
    :class="[
      'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 active:scale-[0.97]',
      variantStyles[variant],
      sizeStyles[size],
      disabled ? 'opacity-40 pointer-events-none' : '',
      roundedClass,
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  tag?: string
}>(), {
  variant: 'primary',
  size: 'sm',
  disabled: false,
  tag: 'button',
})

const variantStyles: Record<string, string> = {
  primary: 'bg-blue-500 text-white active:bg-blue-600',
  secondary: 'bg-gray-900 text-white active:bg-gray-800',
  danger: 'bg-red-500 text-white active:bg-red-600',
  ghost: 'text-gray-600 hover:bg-black/[0.04] active:bg-black/[0.06]',
  glass: 'bg-white/70 backdrop-blur-xl text-gray-900 border border-black/[0.06] active:bg-white/60',
}

const sizeStyles: Record<string, string> = {
  xs: 'text-[12px] px-2 py-1',
  sm: 'text-[13px] px-2.5 py-1.5',
  md: 'text-[14px] px-3 py-2',
  lg: 'text-[15px] px-4 py-2.5',
}

const roundedClass = 'rounded-xl'
</script>
