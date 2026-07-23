<template>
  <div class="relative">
    <label v-if="label" class="block text-[12px] font-medium text-pink-400 mb-1.5">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="w-full h-10 px-3.5 bg-white/50 backdrop-blur-sm rounded-xl text-[13px] text-[#1C1917] placeholder-pink-300 border border-white/50 transition-all duration-150 focus:outline-none focus:bg-white/70 focus:border-pink-300 focus:shadow-[0_0_0_3px_rgba(244,114,182,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
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
