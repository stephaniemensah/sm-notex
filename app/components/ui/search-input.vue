<template>
  <div class="relative">
    <svg class="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="w-full h-10 pl-9 pr-3 bg-[#F5F5F4] rounded-xl text-[13px] text-[#1C1917] placeholder-[#A8A29E] border border-transparent transition-all duration-150 focus:outline-none focus:bg-white focus:border-[#E7E5E4] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.08)]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Search...',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

defineExpose({ inputRef })
</script>
