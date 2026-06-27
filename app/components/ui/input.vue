<template>
  <div>
    <label v-if="label" class="block text-[12px] font-medium text-gray-500 mb-1">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="w-full px-3 py-2.5 bg-black/[0.03] rounded-xl text-[14px] border border-black/[0.06] focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
