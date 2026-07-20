<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]" @click="$emit('close')"></div>

        <div
          ref="sheetRef"
          class="relative bg-white w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] z-10 touch-pan-y shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
          :style="isDragging ? { transform: `translateY(${dragY}px)` } : {}"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="flex justify-center pt-3 pb-1 sm:hidden">
            <div class="w-9 h-[3px] bg-[#D6D3D1] rounded-full"></div>
          </div>

          <div v-if="title" class="flex items-center justify-between px-5 pt-4 pb-3">
            <h3 class="text-[15px] font-semibold text-[#1C1917]">{{ title }}</h3>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F5F5F4] transition-colors"
              @click="$emit('close')"
            >
              <svg class="w-3.5 h-3.5 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 pb-6 max-h-[70vh] overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
}>()

defineEmits<{
  close: []
}>()

const sheetRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragY = ref(0)
const startY = ref(0)

function onTouchStart(e: TouchEvent) {
  if (!e.touches[0]) return
  startY.value = e.touches[0].clientY
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!e.touches[0]) return
  const delta = e.touches[0].clientY - startY.value
  if (delta > 0) dragY.value = delta
}

function onTouchEnd() {
  isDragging.value = false
  if (dragY.value > 120) {
    dragY.value = 0
    const emit = defineEmits<{ close: [] }>()
    emit('close')
  } else {
    dragY.value = 0
  }
}
</script>
