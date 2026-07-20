<template>
  <UiModal :show="show" @close="$emit('cancel')">
    <div class="text-center py-2">
      <div class="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      <h3 class="text-[15px] font-semibold text-[#1C1917] mb-1">{{ title }}</h3>
      <p class="text-[13px] text-[#78716C] leading-relaxed mb-5">{{ message }}</p>
      <div class="flex gap-2">
        <UiButton
          variant="secondary"
          size="md"
          class="flex-1"
          @click="$emit('cancel')"
        >
          Cancel
        </UiButton>
        <UiButton
          variant="danger"
          size="md"
          class="flex-1"
          @click="$emit('confirm')"
        >
          Delete
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
