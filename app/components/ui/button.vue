<template>
  <component
    :is="tag"
    :class="classes"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <svg v-if="loading" class="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  tag?: string
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'sm',
  disabled: false,
  loading: false,
  tag: 'button',
  block: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none rounded-2xl'

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white hover:shadow-[0_8px_24px_rgba(244,114,182,0.35)] hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(244,114,182,0.25)]',
    secondary: 'bg-pink-50 text-pink-600 hover:bg-pink-100 active:bg-pink-200 active:scale-[0.98]',
    ghost: 'text-pink-500 hover:bg-pink-50 hover:text-pink-600 active:bg-pink-100',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] active:scale-[0.98]',
    outline: 'border border-pink-200 text-pink-600 hover:bg-pink-50 active:bg-pink-100 active:scale-[0.98]',
  }

  const sizes: Record<string, string> = {
    xs: 'h-7 px-2.5 text-[11px] rounded-lg gap-1',
    sm: 'h-8 px-3 text-[12px] rounded-lg gap-1.5',
    md: 'h-9 px-4 text-[13px] rounded-xl gap-1.5',
    lg: 'h-10 px-5 text-[14px] rounded-xl gap-2',
  }

  const blockClass = props.block ? 'w-full' : ''

  return [base, variants[props.variant], sizes[props.size], blockClass].join(' ')
})
</script>
