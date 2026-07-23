<template>
  <div class="flex items-center justify-between px-4 h-14 border-b border-white/30 bg-white/30 backdrop-blur-sm flex-shrink-0">
    <button
      class="flex items-center gap-1 text-pink-400 hover:text-pink-600 transition-colors active:scale-95"
      @click="handleBack"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      <span class="text-[13px] font-medium">Back</span>
    </button>

    <div v-if="title" class="absolute left-1/2 -translate-x-1/2">
      <span class="text-[14px] font-semibold text-pink-600">{{ title }}</span>
    </div>

    <div class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  backTo?: string
  customBack?: boolean
}>(), {
  customBack: false
})

const emit = defineEmits<{
  back: []
}>()

const router = useRouter()

function handleBack() {
  if (props.customBack) {
    emit('back')
  } else if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>
