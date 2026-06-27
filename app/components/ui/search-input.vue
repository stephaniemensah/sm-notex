<template>
  <div class="relative">
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="w-full px-3 py-2.5 pl-9 bg-black/[0.03] rounded-xl text-[14px] border border-black/[0.06] focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
    <UiIcon name="search" class="!w-4 !h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
