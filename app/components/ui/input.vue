<template>
  <div class="relative">
    <label v-if="label" class="block text-[12px] font-medium text-[#78716C] mb-1.5">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="w-full h-10 px-3.5 bg-[#F5F5F4] rounded-xl text-[13px] text-[#1C1917] placeholder-[#A8A29E] border border-transparent transition-all duration-150 focus:outline-none focus:bg-white focus:border-[#E7E5E4] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.08)] disabled:opacity-50 disabled:cursor-not-allowed"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
